import { Injectable } from '@angular/core';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { MealAnalysis, NutrientElement } from '../models/nutrition.model';

@Injectable({
  providedIn: 'root',
})
export class GeminiNutritionService {
  private readonly API_KEY = 'AIzaSyDd9L_kxeX6z4YGFblnUd8QSCKww0uMLRQ';
  private genAI: GoogleGenerativeAI;

  constructor() {
    this.genAI = new GoogleGenerativeAI(this.API_KEY);
  }

  async analyzeMeal(mealDescription: string, imageBase64?: string): Promise<MealAnalysis> {
    console.log('GeminiNutritionService: analyzeMeal started', {
      mealDescription,
      hasImage: !!imageBase64,
    });
    // Use gemini-2.5-flash as requested
    const model = this.genAI.getGenerativeModel({
      model: 'gemini-2.5-flash',
      generationConfig: {
        responseMimeType: 'application/json',
        temperature: 0.3,
      },
    });

    try {
      const parts: any[] = [];
      const promptText = imageBase64
        ? `Analyze this image of food. ${
            mealDescription ? `Additional context: ${mealDescription}` : ''
          } Provide detailed nutritional breakdown.`
        : `Analyze the following meal: "${mealDescription}". Provide detailed nutritional breakdown including:
        - Total calories
        - Macronutrients (Protein, Carbohydrates, Fats)
        - Fiber, Sugar
        - Vitamins (A, C, D, B12, B6, E, K)
        - Minerals (Calcium, Iron, Potassium, Sodium, Magnesium, Zinc)
        
        For each nutrient, include the amount, unit, and percentage of daily value where applicable.
        
        Return ONLY valid JSON with this structure:
        {
          "calories": number,
          "servingSize": "string",
          "elements": [
            { "name": "string", "amount": number, "unit": "string", "dailyValue": number }
          ]
        }`;

      parts.push(promptText);

      if (imageBase64) {
        const cleanBase64 = imageBase64.replace(/^data:image\/\w+;base64,/, '');
        parts.push({
          inlineData: {
            data: cleanBase64,
            mimeType: 'image/jpeg',
          },
        });
      }

      // Create a timeout promise (10s)
      let timeoutId: any;
      const timeoutPromise = new Promise<never>((_, reject) => {
        timeoutId = setTimeout(() => {
          console.warn('GeminiNutritionService: Timeout reached (10s)');
          reject(new Error('Gemini API request timed out after 10 seconds'));
        }, 10000);
      });

      // Build a generation request using the generative model instance we created above
      // The SDK's generative model exposes a generateContent method that accepts the parts
      console.log('GeminiNutritionService: Calling generateContent');
      const apiPromise = model.generateContent(parts);

      // Race the request against the timeout so we don't hang indefinitely
      console.log('GeminiNutritionService: Starting Promise.race');
      let result;
      try {
        result = await Promise.race([apiPromise, timeoutPromise]);
        clearTimeout(timeoutId); // Clear timeout on success
      } catch (error) {
        clearTimeout(timeoutId); // Clear timeout on error
        throw error;
      }
      console.log('GeminiNutritionService: Promise.race resolved', result);

      // The SDK may return either an object with a `text` property or a `response` object
      // whose `.text()` is a method. Handle both cases robustly.
      let responseText: string | undefined;

      if (!result) {
        throw new Error('No response from Gemini API');
      }

      // Case A: result.text is a string
      if ((result as any).text && typeof (result as any).text === 'string') {
        responseText = (result as any).text;
      } else if ((result as any).response) {
        // Case B: result.response may expose text or a text() method
        const resp = (result as any).response;
        if (resp && typeof resp.text === 'function') {
          responseText = await resp.text();
        } else if (resp && typeof resp.text === 'string') {
          responseText = resp.text;
        }
      }

      if (!responseText) {
        throw new Error('No response from Gemini API');
      }

      console.log(
        'GeminiNutritionService: Response text received',
        responseText.substring(0, 100) + '...'
      );
      const parsed = JSON.parse(responseText);

      return {
        calories: parsed.calories || 0,
        servingSize: parsed.servingSize,
        elements: parsed.elements || [],
        confidence: 1.0,
      };
    } catch (error) {
      console.error('Gemini API Error:', error);

      // Fallback to mock data
      console.warn('Using mock data as fallback due to error/timeout');
      return this.getMockAnalysis(mealDescription);
    }
  }

  private getMockAnalysis(mealDescription: string): MealAnalysis {
    const mockElements: NutrientElement[] = [
      { name: 'Protein', amount: 35, unit: 'g', dailyValue: 70 },
      { name: 'Carbohydrates', amount: 45, unit: 'g', dailyValue: 15 },
      { name: 'Fats', amount: 12, unit: 'g', dailyValue: 18 },
      { name: 'Fiber', amount: 8, unit: 'g', dailyValue: 32 },
      { name: 'Vitamin C', amount: 25, unit: 'mg', dailyValue: 28 },
      { name: 'Calcium', amount: 150, unit: 'mg', dailyValue: 15 },
      { name: 'Iron', amount: 4, unit: 'mg', dailyValue: 22 },
      { name: 'Potassium', amount: 450, unit: 'mg', dailyValue: 13 },
      { name: 'Sodium', amount: 650, unit: 'mg', dailyValue: 28 },
    ];

    return {
      calories: 480,
      servingSize: '1 serving (estimated)',
      elements: mockElements,
      confidence: 0.5, // Indicate this is mock data
    };
  }
}
