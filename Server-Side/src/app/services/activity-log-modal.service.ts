import { Injectable } from '@angular/core';
import { ActivityLog } from '../models/activity-log-data.model'; 

@Injectable({
  providedIn: 'root'
})
export class ActivityModalService { 

  private readonly STORAGE_KEY = 'wellness_activities_log';

  constructor() { }

  /**
   * جلب جميع الأنشطة المحفوظة من Local Storage
   */
  getActivities(): ActivityLog[] {
    // **[التحقق الضروري]**: تحقق مما إذا كنا في بيئة المتصفح قبل استخدام localStorage
    if (typeof localStorage === 'undefined') {
      return []; // إرجاع مصفوفة فارغة في حالة العرض من جانب الخادم (SSR)
    }
    
    const activitiesJson = localStorage.getItem(this.STORAGE_KEY);
    
    if (activitiesJson) {
      const activities: ActivityLog[] = JSON.parse(activitiesJson);
      // تحويل حقل التاريخ من string إلى Date object
      return activities.map(activity => ({
        ...activity,
        date: new Date(activity.date) 
      }));
    }
    
    return [];
  }

  /**
   * إضافة نشاط جديد وحفظ القائمة المحدثة
   */
  addActivity(newActivity: ActivityLog): void {
    // **[التحقق الضروري]**: تحقق مما إذا كنا في بيئة المتصفح قبل استخدام localStorage
    if (typeof localStorage === 'undefined') {
      return; 
    }
    
    const currentActivities = this.getActivities();
    
    // تعيين ID فريد (باستخدام الوقت الحالي) وتاريخ التسجيل
    newActivity.id = Date.now(); 
    newActivity.date = new Date(); 

    currentActivities.push(newActivity);

    // حفظ القائمة بالكامل في Local Storage
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(currentActivities));
  }
  
  /**
   * حذف نشاط محدد بواسطة ID
   */
  deleteActivity(id: number): void {
    // **[التحقق الضروري]**: تحقق مما إذا كنا في بيئة المتصفح قبل استخدام localStorage
    if (typeof localStorage === 'undefined') {
      return;
    }
    
    let currentActivities = this.getActivities();
    // تصفية القائمة وإبقاء الأنشطة التي لا يتطابق ID الخاص بها مع الـ ID المراد حذفه
    currentActivities = currentActivities.filter(activity => activity.id !== id);
    // حفظ القائمة الجديدة
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(currentActivities));
  }

  /**
   * مسح كل الأنشطة
   */
  clearAllActivities(): void {
    // **[التحقق الضروري]**: تحقق مما إذا كنا في بيئة المتصفح قبل استخدام localStorage
    if (typeof localStorage !== 'undefined') {
      localStorage.removeItem(this.STORAGE_KEY);
    }
  }
}