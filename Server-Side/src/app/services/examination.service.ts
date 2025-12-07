import { Injectable } from '@angular/core';

export interface ExaminationRecord {
  id: string;
  type: '3min' | '6min' | '9min';
  timestamp: Date;
  data: any;
}

export interface MetricInsights {
  eyeStrain: {
    average: number;
    status: 'good' | 'needs-attention' | 'high';
    lastLogged: string;
    progress: number;
  };
  backPosture: {
    average: number;
    status: 'good' | 'needs-attention' | 'high';
    lastLogged: string;
    progress: number;
  };
  neckTension: {
    average: number;
    status: 'good' | 'needs-attention' | 'high';
    lastLogged: string;
    progress: number;
  };
  weight: {
    current: number;
    bmi: number;
    lastLogged: string;
  };
  activityEnergy: {
    averageEnergy: number;
    status: 'good' | 'needs-attention' | 'high';
    lastLogged: string;
    progress: number;
    movementPercentage: number;
    averageSittingTime: string;
  };
}

@Injectable({
  providedIn: 'root',
})
export class ExaminationService {
  private readonly STORAGE_KEY = 'examination_records';
  private records: ExaminationRecord[] = [];

  constructor() {
    this.loadRecords();
  }

  private loadRecords(): void {
    const stored = localStorage.getItem(this.STORAGE_KEY);
    if (stored) {
      this.records = JSON.parse(stored).map((record: any) => ({
        ...record,
        timestamp: new Date(record.timestamp),
      }));
    }
  }

  private saveRecords(): void {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.records));
  }

  addExamination(type: '3min' | '6min' | '9min', data: any): void {
    const record: ExaminationRecord = {
      id: Date.now().toString(),
      type,
      timestamp: new Date(),
      data,
    };
    this.records.unshift(record); // Add to beginning
    this.saveRecords();
  }

  getLastNRecords(n: number = 7): ExaminationRecord[] {
    return this.records.slice(0, n);
  }

  private getTimeSince(date: Date): string {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 60) {
      return `${diffMins} minute${diffMins !== 1 ? 's' : ''} ago`;
    } else if (diffHours < 24) {
      return `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`;
    } else if (diffDays === 1) {
      return 'Yesterday';
    } else if (diffDays < 7) {
      return `${diffDays} days ago`;
    } else {
      return date.toLocaleDateString();
    }
  }

  private calculateStatus(average: number, max: number): 'good' | 'needs-attention' | 'high' {
    const percentage = (average / max) * 100;
    if (percentage <= 40) return 'good';
    if (percentage <= 70) return 'needs-attention';
    return 'high';
  }

  getMetricInsights(): MetricInsights {
    const last7 = this.getLastNRecords(7);

    // Default values
    const defaultInsights: MetricInsights = {
      eyeStrain: {
        average: 0,
        status: 'good',
        lastLogged: 'No data yet',
        progress: 0,
      },
      backPosture: {
        average: 0,
        status: 'good',
        lastLogged: 'No data yet',
        progress: 0,
      },
      neckTension: {
        average: 0,
        status: 'good',
        lastLogged: 'No data yet',
        progress: 0,
      },
      weight: {
        current: 0,
        bmi: 0,
        lastLogged: 'No data yet',
      },
      activityEnergy: {
        averageEnergy: 0,
        status: 'good',
        lastLogged: 'No data yet',
        progress: 0,
        movementPercentage: 0,
        averageSittingTime: '--',
      },
    };

    if (last7.length === 0) {
      return defaultInsights;
    }

    // Calculate Eye Strain (from all check types)
    const eyeStrainValues: number[] = [];
    last7.forEach((record) => {
      if (record.type === '3min' && record.data.eyeStrain !== null) {
        eyeStrainValues.push(record.data.eyeStrain ? 4 : 1); // Yes = 4, No = 1
      } else if (record.type === '6min' && record.data.eyeComfort) {
        const comfortMap: { [key: string]: number } = {
          Comfortable: 1,
          'A little tired': 3,
          'Very strained': 5,
        };
        eyeStrainValues.push(comfortMap[record.data.eyeComfort] || 0);
      } else if (record.type === '9min' && record.data.eyeStrainLevel !== null) {
        eyeStrainValues.push(record.data.eyeStrainLevel);
      }
    });
    const eyeStrainAvg =
      eyeStrainValues.length > 0
        ? eyeStrainValues.reduce((a, b) => a + b, 0) / eyeStrainValues.length
        : 0;

    // Calculate Back & Posture (average of back discomfort ratings)
    const backValues: number[] = [];
    last7.forEach((record) => {
      if (record.type === '3min' && record.data.lowerBackComfort !== null) {
        backValues.push(6 - record.data.lowerBackComfort); // Invert: 5=comfort becomes 1=discomfort
      } else if (record.type === '6min' && record.data.lowerBackDiscomfort !== null) {
        backValues.push(record.data.lowerBackDiscomfort);
      } else if (record.type === '9min') {
        if (record.data.upperBackDiscomfort !== null && record.data.lowerBackDiscomfort !== null) {
          backValues.push((record.data.upperBackDiscomfort + record.data.lowerBackDiscomfort) / 2);
        }
      }
    });
    const backAvg =
      backValues.length > 0 ? backValues.reduce((a, b) => a + b, 0) / backValues.length : 0;

    // Calculate Neck Tension
    const neckValues: number[] = [];
    last7.forEach((record) => {
      if (record.type === '3min' && record.data.neckComfort !== null) {
        neckValues.push(6 - record.data.neckComfort); // Invert scale
      } else if (record.type === '6min' && record.data.neckDiscomfort !== null) {
        neckValues.push(record.data.neckDiscomfort);
      } else if (record.type === '9min' && record.data.neckDiscomfort !== null) {
        neckValues.push(record.data.neckDiscomfort);
      }
    });
    const neckAvg =
      neckValues.length > 0 ? neckValues.reduce((a, b) => a + b, 0) / neckValues.length : 0;

    // Get last logged times
    const lastEyeRecord = last7.find(
      (r) =>
        (r.type === '3min' && r.data.eyeStrain !== null) ||
        (r.type === '6min' && r.data.eyeComfort) ||
        (r.type === '9min' && r.data.eyeStrainLevel !== null)
    );
    const lastBackRecord = last7.find(
      (r) =>
        (r.type === '3min' && r.data.lowerBackComfort !== null) ||
        (r.type === '6min' && r.data.lowerBackDiscomfort !== null) ||
        (r.type === '9min' && r.data.lowerBackDiscomfort !== null)
    );
    const lastNeckRecord = last7.find(
      (r) =>
        (r.type === '3min' && r.data.neckComfort !== null) ||
        (r.type === '6min' && r.data.neckDiscomfort !== null) ||
        (r.type === '9min' && r.data.neckDiscomfort !== null)
    );

    // Calculate Activity & Energy
    const energyValues: number[] = [];
    const sittingTimes: string[] = [];
    let movementCount = 0;
    let totalChecks = 0;

    last7.forEach((record) => {
      // Energy level from all check types
      if (record.data.energyLevel !== null && record.data.energyLevel !== undefined) {
        energyValues.push(record.data.energyLevel);
      }

      // Movement data from 9min check
      if (record.type === '9min' && record.data.movements) {
        totalChecks++;
        const hasMovement =
          record.data.movements.shortWalks ||
          record.data.movements.fullBodyStretches ||
          record.data.movements.handWristStretches;
        if (hasMovement) {
          movementCount++;
        }
        if (record.data.sittingTime) {
          sittingTimes.push(record.data.sittingTime);
        }
      }
    });

    const energyAvg =
      energyValues.length > 0 ? energyValues.reduce((a, b) => a + b, 0) / energyValues.length : 0;

    const movementPercentage =
      totalChecks > 0 ? Math.round((movementCount / totalChecks) * 100) : 0;

    const avgSittingTime =
      sittingTimes.length > 0
        ? sittingTimes[0] // Use most recent for now
        : '--';

    // Determine status based on energy level (1-10 scale, inverted)
    const energyStatus = this.calculateEnergyStatus(energyAvg);

    const lastEnergyRecord = last7.find((r) => r.data.energyLevel !== null);

    return {
      eyeStrain: {
        average: Math.round(eyeStrainAvg * 10) / 10,
        status: this.calculateStatus(eyeStrainAvg, 5),
        lastLogged: lastEyeRecord ? this.getTimeSince(lastEyeRecord.timestamp) : 'No data yet',
        progress: Math.min((eyeStrainAvg / 5) * 100, 100),
      },
      backPosture: {
        average: Math.round(backAvg * 10) / 10,
        status: this.calculateStatus(backAvg, 5),
        lastLogged: lastBackRecord ? this.getTimeSince(lastBackRecord.timestamp) : 'No data yet',
        progress: Math.min((backAvg / 5) * 100, 100),
      },
      neckTension: {
        average: Math.round(neckAvg * 10) / 10,
        status: this.calculateStatus(neckAvg, 5),
        lastLogged: lastNeckRecord ? this.getTimeSince(lastNeckRecord.timestamp) : 'No data yet',
        progress: Math.min((neckAvg / 5) * 100, 100),
      },
      weight: this.getWeightBMIData(),
      activityEnergy: {
        averageEnergy: Math.round(energyAvg * 10) / 10,
        status: energyStatus,
        lastLogged: lastEnergyRecord
          ? this.getTimeSince(lastEnergyRecord.timestamp)
          : 'No data yet',
        progress: Math.min((energyAvg / 10) * 100, 100),
        movementPercentage,
        averageSittingTime: avgSittingTime,
      },
    };
  }

  private calculateEnergyStatus(average: number): 'good' | 'needs-attention' | 'high' {
    // For energy, higher is better (1-10 scale)
    // Good: 7-10, Needs Attention: 4-6, Low (high concern): 1-3
    if (average >= 7) return 'good';
    if (average >= 4) return 'needs-attention';
    return 'high';
  }

  private getWeightBMIData(): { current: number; bmi: number; lastLogged: string } {
    const stored = localStorage.getItem('bmi_data');
    if (stored) {
      const data = JSON.parse(stored);
      return {
        current: data.weight || 0,
        bmi: data.bmi || 0,
        lastLogged: this.getTimeSince(new Date(data.timestamp)),
      };
    }
    return {
      current: 0,
      bmi: 0,
      lastLogged: 'No data yet',
    };
  }
}
