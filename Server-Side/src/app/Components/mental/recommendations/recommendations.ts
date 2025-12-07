import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { MentalService } from '../../../services/mental.service';

interface Exercise {
  duration: string;
  title: string;
  steps: string[];
  benefits: string;
  emoji: string;
}

interface OfficeTip {
  title: string;
  description: string;
  icon: string;
}

interface QuickFix {
  title: string;
  description: string;
}

interface Reminder {
  text: string;
}

interface Recommendation {
  title: string;
  description: string;
  image: string;
  type: string;
  sectionScore?: number;
}

@Component({
  selector: 'app-recommendations',
  imports: [CommonModule],
  templateUrl: './recommendations.html',
  styleUrls: ['./recommendations.css'],
  standalone: true,
})
export class Recommendations implements OnInit, OnDestroy {
  showExerciseModal = false;
  selectedRecommendation: string = '';
  private dataSubscription?: Subscription;
  showNoRecommendationsMessage = false;
  showNoChecksMessage = false;

  // Section to recommendation type mapping
  private sectionToRecommendationMap: { [key: string]: string } = {
    stress_mental_load: 'stress-mental-load',
    focus_attention: 'focus-attention',
    motivation_productivity: 'motivation-productivity',
    sleep_recovery: 'sleep-recovery',
    emotional_wellbeing: 'emotional-wellbeing',
    digital_overuse: 'digital-overuse',
  };

  private allRecommendations: Recommendation[] = [
    {
      title: 'Stress & Mental Load',
      description: 'Techniques to reduce stress and manage mental workload effectively.',
      image: 'assets/images/stress.png',
      type: 'stress-mental-load',
    },
    {
      title: 'Focus & Attention',
      description: 'Improve concentration and maintain sustained attention.',
      image: 'assets/images/focus.png',
      type: 'focus-attention',
    },
    {
      title: 'Motivation & Productivity',
      description: 'Boost motivation and enhance your daily productivity.',
      image: 'assets/images/motivation.png',
      type: 'motivation-productivity',
    },
    {
      title: 'Sleep & Mental Recovery',
      description: 'Improve sleep quality and mental restoration practices.',
      image: 'assets/images/sleep.png',
      type: 'sleep-recovery',
    },
    {
      title: 'Emotional Wellbeing & Mood',
      description: 'Enhance emotional health and regulate mood effectively.',
      image: 'assets/images/mood.png',
      type: 'emotional-wellbeing',
    },
    {
      title: 'Digital Overuse / Tech Fatigue',
      description: 'Manage screen time and reduce digital fatigue.',
      image: 'assets/images/digital.png',
      type: 'digital-overuse',
    },
  ];

  recommendations: Recommendation[] = [];

  constructor(private mentalService: MentalService) {}

  ngOnInit(): void {
    this.prioritizeRecommendations();
    this.dataSubscription = this.mentalService.dataUpdated$.subscribe(() => {
      this.prioritizeRecommendations();
    });
  }

  ngOnDestroy(): void {
    if (this.dataSubscription) {
      this.dataSubscription.unsubscribe();
    }
  }

  private prioritizeRecommendations(): void {
    const history = this.mentalService.getHistory();

    if (history.length === 0) {
      this.showNoChecksMessage = true;
      this.showNoRecommendationsMessage = false;
      this.recommendations = [];
      return;
    }

    this.showNoChecksMessage = false;

    const sectionScoreMap: { [key: string]: number[] } = {};

    history.forEach((check) => {
      check.sectionResults.forEach((result) => {
        if (!sectionScoreMap[result.sectionId]) {
          sectionScoreMap[result.sectionId] = [];
        }
        sectionScoreMap[result.sectionId].push(result.normalizedScore);
      });
    });

    const averageSectionScores: { [key: string]: number } = {};
    Object.keys(sectionScoreMap).forEach((sectionId) => {
      const scores = sectionScoreMap[sectionId];
      const average = scores.reduce((sum, score) => sum + score, 0) / scores.length;
      averageSectionScores[sectionId] = Math.round(average * 100) / 100;
    });

    this.recommendations = this.allRecommendations.map((rec) => {
      const matchingSectionId = Object.keys(this.sectionToRecommendationMap).find(
        (sectionId) => this.sectionToRecommendationMap[sectionId] === rec.type
      );

      if (matchingSectionId && averageSectionScores[matchingSectionId] !== undefined) {
        return {
          ...rec,
          sectionScore: averageSectionScores[matchingSectionId],
        };
      }

      return rec;
    });

    this.recommendations.sort((a, b) => {
      if (a.sectionScore !== undefined && b.sectionScore === undefined) {
        return -1;
      }
      if (a.sectionScore === undefined && b.sectionScore !== undefined) {
        return 1;
      }

      if (a.sectionScore !== undefined && b.sectionScore !== undefined) {
        return a.sectionScore - b.sectionScore;
      }

      return 0;
    });

    this.recommendations = this.recommendations.filter(
      (rec) => rec.sectionScore !== undefined && rec.sectionScore < 90
    );

    if (this.recommendations.length === 0) {
      this.showNoRecommendationsMessage = true;
    } else {
      this.showNoRecommendationsMessage = false;
      this.recommendations = this.recommendations.slice(0, 3);
    }
  }

  // ===== STRESS & MENTAL LOAD MODULE =====
  stressOfficeTips: OfficeTip[] = [
    {
      icon: '✔',
      title: 'Break Tasks Into Small Chunks',
      description: 'Large projects or long study sessions increase mental load. Divide tasks into small, manageable steps.',
    },
    {
      icon: '✔',
      title: 'Use a Task Planner or Digital To-Do List',
      description: 'Write down what you need to do; seeing it reduces anxiety and frees mental space.',
    },
    {
      icon: '✔',
      title: 'Keep a Clean & Organized Workspace',
      description: 'A cluttered desk or desktop increases cognitive stress. Reduce visual chaos.',
    },
    {
      icon: '✔',
      title: 'Set Clear Boundaries for Work/Study Time',
      description: 'Avoid checking emails or studying outside set times — mental separation is key.',
    },
    {
      icon: '✔',
      title: 'Practice Short Pauses Between Tasks',
      description: 'Even 1–2 minutes to stand up, stretch, or breathe reduces accumulated stress.',
    },
    {
      icon: '✔',
      title: 'Prioritize Important Tasks',
      description: 'Focus on what really matters; don\'t get lost in low-impact tasks.',
    },
    {
      icon: '✔',
      title: 'Use Background Music or Ambient Sound',
      description: 'Soft, calming sound can improve concentration and reduce perceived stress.',
    },
  ];

  stressExercises: Exercise[] = [
    {
      emoji: '🔹',
      title: '1-Minute Shoulder & Neck Release',
      duration: '60 seconds',
      steps: [
        'Sit tall, roll shoulders forward 5×, backward 5×.',
        'Drop your head gently to the right, hold 10s; left, hold 10s.',
        'Take a deep breath in/out.',
      ],
      benefits: 'Reduces tension from sitting and mental load.',
    },
    {
      emoji: '🔹',
      title: '90-Second Mental Reset',
      duration: '90 seconds',
      steps: [
        'Close your eyes for 10 seconds.',
        'Inhale slowly 4s, hold 4s, exhale 6s — repeat 2×.',
        'Focus on feeling your feet on the floor.',
      ],
      benefits: 'Helps pause mental chatter and reset focus.',
    },
    {
      emoji: '🔹',
      title: '2-Minute Desk Stretch & Posture Reset',
      duration: '2 minutes',
      steps: [
        'Stand, interlace hands behind back, lift gently for 20s.',
        'Side stretch: right 10s, left 10s.',
        'Forward fold (hinge at hips) for 20s.',
        'Shake out arms and shoulders for 20s.',
      ],
      benefits: 'Reduces accumulated muscular tension linked to stress.',
    },
    {
      emoji: '🔹',
      title: '3-Minute Breathing & Visualization',
      duration: '3 minutes',
      steps: [
        'Sit upright, hands on belly.',
        'Deep diaphragmatic breathing — 1 minute (inhale 4s, hold 4s, exhale 6s).',
        'Close eyes and imagine a calming scene — 1 minute.',
        'Roll shoulders slowly for 30s.',
      ],
      benefits: 'Combines breathing, relaxation, and micro meditation.',
    },
  ];

  stressQuickFixes: QuickFix[] = [
    {
      title: 'Take One Deep Breath',
      description: 'Instantly lowers stress hormones.',
    },
    {
      title: 'Stretch Your Neck & Shoulders',
      description: 'Relieves tension built from prolonged sitting.',
    },
    {
      title: 'Close Your Eyes Briefly',
      description: 'Gives your brain a 10-second "reset button."',
    },
    {
      title: 'Shake Out Your Hands/Arms',
      description: 'Reduces physical tension from typing or holding devices.',
    },
    {
      title: 'Change Your Scenery for 30 Seconds',
      description: 'Look out the window or stand and walk — mental refresh.',
    },
  ];

  stressBoosters: QuickFix[] = [
    {
      title: 'Pomodoro Micro-Session',
      description: 'Work for 25 minutes, then 3–5 minute break — reduces stress from overload.',
    },
    {
      title: 'Single-Task Challenge (90 Seconds)',
      description: 'Focus only on one small task — prevents mental multitasking overload.',
    },
    {
      title: 'Mini Gratitude Pause (30 Seconds)',
      description: 'Think of 1–2 positive things about your day — reduces stress perception.',
    },
    {
      title: 'Micro-Walk or Movement Break (20–40 Seconds)',
      description: 'Boosts circulation and mental clarity.',
    },
  ];

  stressReminders: Reminder[] = [
    { text: 'Take a 60-second mental pause.' },
    { text: 'Break your tasks into small steps.' },
    { text: 'Stand up and stretch every 30–40 minutes.' },
    { text: 'One task at a time — don\'t multitask.' },
    { text: 'Breathe slowly and deeply.' },
    { text: 'Organize your workspace — clear desk, clear mind.' },
    { text: 'Remember to hydrate — water helps your brain.' },
  ];

  // ===== FOCUS & ATTENTION MODULE =====
  focusOfficeTips: OfficeTip[] = [
    {
      icon: '✔',
      title: 'Position Your Screen Properly',
      description: 'Keep your monitor at eye level and about 50–70 cm away — reduces strain and helps attention.',
    },
    {
      icon: '✔',
      title: 'Keep Your Desk Clutter-Free',
      description: 'Visual clutter distracts the brain — organize your workspace for better concentration.',
    },
    {
      icon: '✔',
      title: 'Use Noise Control',
      description: 'Headphones, white noise, or ambient music helps block distractions.',
    },
    {
      icon: '✔',
      title: 'Set Clear Goals for Each Session',
      description: 'Write down what you want to achieve before starting — keeps attention on task.',
    },
    {
      icon: '✔',
      title: 'Minimize Multitasking',
      description: 'Switching tasks rapidly decreases efficiency and focus.',
    },
    {
      icon: '✔',
      title: 'Use Timers or Pomodoro Techniques',
      description: 'Short bursts of focused work (25–30 minutes) with micro breaks improve attention span.',
    },
    {
      icon: '✔',
      title: 'Adjust Lighting & Environment',
      description: 'Natural light or soft lighting reduces eye strain and mental fatigue.',
    },
  ];

  focusExercises: Exercise[] = [
    {
      emoji: '🔹',
      title: '1-Minute Visual Reset',
      duration: '60 seconds',
      steps: [
        'Sit upright, relax shoulders.',
        'Look away from the screen for 10 seconds.',
        'Focus on a distant object for 20 seconds.',
      ],
      benefits: 'Refreshes your visual system and reduces eye fatigue.',
    },
    {
      emoji: '🔹',
      title: '90-Second Breathing Focus',
      duration: '90 seconds',
      steps: [
        'Inhale deeply for 4s, hold 4s, exhale 6s — repeat twice.',
        'While breathing, concentrate on a single task mentally.',
      ],
      benefits: 'Combines relaxation with mental sharpening.',
    },
    {
      emoji: '🔹',
      title: '2-Minute Desk Movement',
      duration: '2 minutes',
      steps: [
        'Stand, reach arms overhead — 10s.',
        'Side stretch right/left — 10s each.',
        'Roll shoulders forward/backward — 10 reps.',
      ],
      benefits: 'Reduces physical tension that blocks focus.',
    },
    {
      emoji: '🔹',
      title: '3-Minute Mind Reboot',
      duration: '3 minutes',
      steps: [
        'Close eyes for 30s, visualize completing a task successfully.',
        'Open eyes, write down the next three steps in your task.',
        'Take two deep breaths — 10s each.',
      ],
      benefits: 'Clears mental clutter and increases productivity.',
    },
  ];

  focusQuickFixes: QuickFix[] = [
    {
      title: 'Blink Slowly 10 Times',
      description: 'Resets eye focus.',
    },
    {
      title: 'Take One Deep Breath',
      description: 'Resets attention.',
    },
    {
      title: 'Stand and Stretch Briefly',
      description: 'Reduces physical fatigue affecting focus.',
    },
    {
      title: 'Look Far Away for 10 Seconds',
      description: 'Relieves eye strain.',
    },
    {
      title: 'Micro Break',
      description: 'Close eyes or stand for 15–20s.',
    },
  ];

  focusBoosters: QuickFix[] = [
    {
      title: 'Single-Task for 90 Seconds',
      description: 'Practice undistracted attention.',
    },
    {
      title: 'Micro-Pomodoro',
      description: '15–20 min focused session + 3 min break.',
    },
    {
      title: 'Visual Timer',
      description: 'Seeing time pass improves attention.',
    },
    {
      title: 'Mini Journaling (30s)',
      description: 'Jot down distractions and reset focus.',
    },
    {
      title: 'Hydrate Quickly',
      description: 'Water improves brain function.',
    },
  ];

  focusReminders: Reminder[] = [
    { text: 'Focus on one task at a time.' },
    { text: 'Stand up and stretch if your mind drifts.' },
    { text: 'Blink and look away from the screen every 20 minutes.' },
    { text: 'Write down what\'s next — plan before acting.' },
    { text: 'Take a micro-breath break.' },
    { text: 'Remove visual clutter to improve concentration.' },
  ];

  // ===== MOTIVATION & PRODUCTIVITY MODULE =====
  motivationOfficeTips: OfficeTip[] = [
    {
      icon: '✔',
      title: 'Set Clear, Achievable Goals',
      description: 'Break large projects into small milestones — completing them increases motivation.',
    },
    {
      icon: '✔',
      title: 'Prioritize Tasks',
      description: 'Focus on high-impact tasks first — reduces overwhelm and boosts productivity.',
    },
    {
      icon: '✔',
      title: 'Use Visual Progress Trackers',
      description: 'Ticking off tasks or seeing progress keeps you motivated.',
    },
    {
      icon: '✔',
      title: 'Keep Your Workspace Organized',
      description: 'A tidy workspace prevents distraction and mental fatigue.',
    },
    {
      icon: '✔',
      title: 'Eliminate Digital Distractions',
      description: 'Turn off notifications, use "Do Not Disturb," or focus apps.',
    },
    {
      icon: '✔',
      title: 'Plan Short Work Bursts',
      description: 'Use Pomodoro or 25–30 minute focused sessions with micro-breaks.',
    },
    {
      icon: '✔',
      title: 'Reward Yourself for Small Wins',
      description: 'Even tiny achievements deserve recognition — reinforces motivation.',
    },
  ];

  motivationExercises: Exercise[] = [
    {
      emoji: '🔹',
      title: '1-Minute Goal Visualization',
      duration: '60 seconds',
      steps: [
        'Sit upright, close your eyes.',
        'Visualize completing a small task successfully — 30s.',
        'Take a deep breath and open your eyes.',
      ],
      benefits: 'Triggers mental readiness and motivation.',
    },
    {
      emoji: '🔹',
      title: '90-Second Desk Stretch & Reset',
      duration: '90 seconds',
      steps: [
        'Stand, reach hands overhead — 10s.',
        'Side bend right/left — 10s each.',
        'Roll shoulders — 10 reps.',
      ],
      benefits: 'Physical movement resets energy and mental focus.',
    },
    {
      emoji: '🔹',
      title: '2-Minute Micro Planning',
      duration: '2 minutes',
      steps: [
        'Write down the next 2–3 small tasks.',
        'Prioritize them from easiest to most important.',
        'Take a deep breath — 10s.',
      ],
      benefits: 'Prepares the brain for productive execution.',
    },
    {
      emoji: '🔹',
      title: '3-Minute Energy Boost',
      duration: '3 minutes',
      steps: [
        'Stand up, shake arms gently for 15s.',
        'March in place for 30s.',
        'Stretch back and shoulders — 20s each.',
        'Deep diaphragmatic breath — 1 minute.',
      ],
      benefits: 'Boosts blood flow and mental energy for motivation.',
    },
  ];

  motivationQuickFixes: QuickFix[] = [
    {
      title: 'Write One Small Task to Do Now',
      description: 'Triggers action.',
    },
    {
      title: 'Take a Deep Breath',
      description: 'Resets energy and focus.',
    },
    {
      title: 'Stretch & Shake Out Arms/Legs',
      description: 'Re-energizes.',
    },
    {
      title: 'Stand Up for 20 Seconds',
      description: 'Micro reset.',
    },
    {
      title: 'Positive Self-Talk',
      description: '"I can finish this" boosts motivation.',
    },
  ];

  motivationBoosters: QuickFix[] = [
    {
      title: 'Micro-Pomodoro (15–20 min)',
      description: 'Focus + break cycle improves output.',
    },
    {
      title: 'Single Task Focus (90 Seconds)',
      description: 'Retrains your brain to avoid multitasking.',
    },
    {
      title: 'Mini Progress Check (30s)',
      description: 'Review what you\'ve done and adjust.',
    },
    {
      title: 'Digital Declutter',
      description: 'Close unnecessary tabs or apps.',
    },
    {
      title: 'Hydrate & Snack Smart',
      description: 'Small water/snack boost fuels mental energy.',
    },
  ];

  motivationReminders: Reminder[] = [
    { text: 'Focus on one task — small steps win the day.' },
    { text: 'Check off a tiny task to kickstart motivation.' },
    { text: 'Take a micro-break every 30–40 minutes.' },
    { text: 'Visualize completing your task before starting.' },
    { text: 'Stretch & breathe — energize your body and mind.' },
    { text: 'Remove distractions — digital clutter kills focus.' },
    { text: 'Reward yourself for even small achievements.' },
  ];

  // ===== SLEEP & RECOVERY MODULE =====
  sleepOfficeTips: OfficeTip[] = [
    {
      icon: '✔',
      title: 'Maintain a Consistent Sleep Schedule',
      description: 'Go to bed and wake up at the same time daily to regulate your circadian rhythm.',
    },
    {
      icon: '✔',
      title: 'Limit Screen Exposure Before Bed',
      description: 'Avoid phones, laptops, or bright screens 30–60 minutes before sleep.',
    },
    {
      icon: '✔',
      title: 'Create a Relaxing Pre-Sleep Routine',
      description: 'Reading, light stretching, or meditation signals your brain to wind down.',
    },
    {
      icon: '✔',
      title: 'Keep Bedroom Dark & Cool',
      description: 'Reduces interruptions and improves sleep quality.',
    },
    {
      icon: '✔',
      title: 'Avoid Caffeine & Heavy Meals Late',
      description: 'Caffeine or heavy food 4–6 hours before bedtime can disturb sleep.',
    },
    {
      icon: '✔',
      title: 'Use Bed Only for Sleep',
      description: 'Avoid working or studying in bed to strengthen mental association with sleep.',
    },
    {
      icon: '✔',
      title: 'Take Short Daytime Breaks',
      description: 'Brief naps or breaks help reduce mental fatigue without disrupting night sleep.',
    },
  ];

  sleepExercises: Exercise[] = [
    {
      emoji: '🔹',
      title: '1-Minute Mind Reset',
      duration: '60 seconds',
      steps: [
        'Sit or lie down comfortably.',
        'Close your eyes and take slow, deep breaths — 10–12 cycles.',
      ],
      benefits: 'Calms your nervous system and prepares for rest.',
    },
    {
      emoji: '🔹',
      title: '90-Second Gentle Stretch',
      duration: '90 seconds',
      steps: [
        'Roll shoulders forward/backward — 5 reps each.',
        'Side bend gently right/left — 10s each.',
      ],
      benefits: 'Releases tension accumulated during the day.',
    },
    {
      emoji: '🔹',
      title: '2-Minute Relaxation Focus',
      duration: '2 minutes',
      steps: [
        'Lie back or sit upright.',
        'Place hands on belly, breathe deeply — inhale 4s, hold 4s, exhale 6s.',
        'Visualize a calm scene — beach, forest, or sky.',
      ],
      benefits: 'Mental decompression before sleep.',
    },
    {
      emoji: '🔹',
      title: '3-Minute Desk/Bed Wind-Down',
      duration: '3 minutes',
      steps: [
        'Stretch arms overhead — 10s.',
        'Forward fold — 20s.',
        'Neck tilt right/left — 10s each.',
        'Shake out hands/arms — 15s.',
        'Close eyes, slow breathing — 1 min.',
      ],
      benefits: 'Prepares both mind and body for restful recovery.',
    },
  ];

  sleepQuickFixes: QuickFix[] = [
    {
      title: 'Blink & Relax Eyes',
      description: 'Reduces eye strain.',
    },
    {
      title: 'Take a Deep Breath',
      description: 'Resets tension.',
    },
    {
      title: 'Stretch Upper Body',
      description: 'Eases muscle tightness.',
    },
    {
      title: 'Stand and Roll Shoulders',
      description: 'Micro reset.',
    },
    {
      title: 'Write a Mini Journal Entry',
      description: 'Offloads mental clutter.',
    },
  ];

  sleepReminders: Reminder[] = [
    { text: 'Wind down 30–60 min before bed.' },
    { text: 'Screens off → rest on.' },
    { text: 'Breathe deeply to calm your mind.' },
    { text: 'Short day naps <20 min if needed.' },
    { text: 'Keep a consistent sleep/wake schedule.' },
    { text: 'Stretch lightly before bed.' },
  ];

  // ===== EMOTIONAL WELLBEING MODULE =====
  emotionalOfficeTips: OfficeTip[] = [
    {
      icon: '✔',
      title: 'Check In With Yourself Daily',
      description: 'Spend 1–2 minutes reflecting on your emotions.',
    },
    {
      icon: '✔',
      title: 'Practice Gratitude',
      description: 'Note 1–2 things that went well each day — improves mood.',
    },
    {
      icon: '✔',
      title: 'Take Micro-Breaks',
      description: 'Stand, stretch, or walk for 1–3 minutes — reduces stress and irritability.',
    },
    {
      icon: '✔',
      title: 'Connect With Others',
      description: 'Even short conversations with friends or colleagues improve emotional health.',
    },
    {
      icon: '✔',
      title: 'Limit Negative News & Social Media',
      description: 'Digital overload can worsen anxiety and mood swings.',
    },
    {
      icon: '✔',
      title: 'Engage in Enjoyable Micro-Activities',
      description: 'Listen to music, doodle, or stretch — small joys boost mood.',
    },
    {
      icon: '✔',
      title: 'Use Deep Breathing for Emotional Regulation',
      description: 'Slows heart rate and calms anxious feelings.',
    },
  ];

  emotionalExercises: Exercise[] = [
    {
      emoji: '🔹',
      title: '1-Minute Emotional Reset',
      duration: '60 seconds',
      steps: [
        'Close eyes, inhale deeply 4s, exhale 6s × 2.',
        'Visualize a positive moment.',
      ],
      benefits: 'Reduces stress and improves mood.',
    },
    {
      emoji: '🔹',
      title: '90-Second Shoulder & Neck Release',
      duration: '90 seconds',
      steps: [
        'Shoulder rolls forward/back — 5 reps each.',
        'Neck tilt right/left — 10s each.',
      ],
      benefits: 'Reduces tension linked to irritability.',
    },
    {
      emoji: '🔹',
      title: '2-Minute Gratitude Pause',
      duration: '2 minutes',
      steps: [
        'Write 1–2 positive things from your day.',
        'Take a slow breath and reflect.',
      ],
      benefits: 'Enhances positivity and emotional resilience.',
    },
    {
      emoji: '🔹',
      title: '3-Minute Micro Walk / Movement',
      duration: '3 minutes',
      steps: [
        'Walk in place or around your desk — 1–2 minutes.',
        'Stretch arms overhead — 10s.',
        'Shake out hands and shoulders — 15s.',
      ],
      benefits: 'Improves circulation and mood.',
    },
  ];

  emotionalQuickFixes: QuickFix[] = [
    {
      title: 'Smile & Relax Jaw',
      description: 'Triggers neural pathways linked to happiness.',
    },
    {
      title: 'Deep Breath',
      description: 'Instant calm.',
    },
    {
      title: 'Close Eyes Briefly',
      description: 'Micro mental reset.',
    },
    {
      title: 'Stand and Stretch',
      description: 'Relieves physical tension.',
    },
    {
      title: 'Positive Self-Talk',
      description: '"I can handle this."',
    },
  ];

  emotionalReminders: Reminder[] = [
    { text: 'Pause and notice your feelings.' },
    { text: 'Stretch, breathe, reset.' },
    { text: 'Smile — even small movements help.' },
    { text: 'Gratitude: think of one good thing today.' },
    { text: 'Connect with someone — short chats matter.' },
  ];

  // ===== DIGITAL OVERUSE MODULE =====
  digitalOfficeTips: OfficeTip[] = [
    {
      icon: '✔',
      title: 'Follow the 20-20-20 Rule',
      description: 'Every 20 min, look at something 20 feet away for 20 seconds.',
    },
    {
      icon: '✔',
      title: 'Take Micro-Breaks from Screens',
      description: 'Even 1–2 minutes standing or stretching reduces eye strain and fatigue.',
    },
    {
      icon: '✔',
      title: 'Adjust Screen Brightness & Contrast',
      description: 'Avoid glare and harsh lighting.',
    },
    {
      icon: '✔',
      title: 'Limit Social Media During Work',
      description: 'Reduces mental fatigue and cognitive overload.',
    },
    {
      icon: '✔',
      title: 'Use Blue Light Filters',
      description: 'Especially for night work or study sessions.',
    },
    {
      icon: '✔',
      title: 'Alternate Between Tasks & Mediums',
      description: 'Mix computer, phone, and offline work (paper/notes).',
    },
    {
      icon: '✔',
      title: 'Hydrate and Move',
      description: 'Screen fatigue is worsened by dehydration and sedentary behavior.',
    },
  ];

  digitalExercises: Exercise[] = [
    {
      emoji: '🔹',
      title: '1-Minute Eye Reset',
      duration: '60 seconds',
      steps: [
        'Blink slowly 10×.',
        'Close eyes for 10s.',
        'Look far away for 10s.',
      ],
      benefits: 'Reduces eye strain quickly.',
    },
    {
      emoji: '🔹',
      title: '90-Second Neck & Shoulder Relief',
      duration: '90 seconds',
      steps: [
        'Shoulder rolls forward/back — 5 reps.',
        'Neck tilt right/left — 10s each.',
      ],
      benefits: 'Relieves tension from prolonged device use.',
    },
    {
      emoji: '🔹',
      title: '2-Minute Screen Detox',
      duration: '2 minutes',
      steps: [
        'Stand and stretch — arms overhead, side bends.',
        'Walk in place or around desk — 30s.',
        'Shake hands and arms — 10s.',
      ],
      benefits: 'Resets body and mind after long screen time.',
    },
    {
      emoji: '🔹',
      title: '3-Minute Micro Break Routine',
      duration: '3 minutes',
      steps: [
        'Close eyes, inhale 4s, hold 4s, exhale 6s — repeat 2×.',
        'Stretch back & shoulders — 20s each.',
        'Look out the window — 30s.',
      ],
      benefits: 'Reduces tech fatigue physically and mentally.',
    },
  ];

  digitalQuickFixes: QuickFix[] = [
    {
      title: 'Blink Slowly 10×',
      description: 'Refreshes dry eyes.',
    },
    {
      title: 'Look Away from Screen',
      description: 'Gives eyes a break.',
    },
    {
      title: 'Stand & Stretch Briefly',
      description: 'Counters sedentary strain.',
    },
    {
      title: 'Deep Breath',
      description: 'Calms screen-induced stress.',
    },
    {
      title: 'Shake Out Arms/Hands',
      description: 'Releases typing tension.',
    },
  ];

  digitalReminders: Reminder[] = [
    { text: 'Follow 20-20-20 for eye health.' },
    { text: 'Stand & move every 30–40 min.' },
    { text: 'Limit unnecessary notifications.' },
    { text: 'Alternate screen tasks with offline tasks.' },
    { text: 'Hydrate regularly.' },
    { text: 'Stretch neck, shoulders, and back often.' },
  ];

  openRecommendation(type: string): void {
    const validTypes = [
      'stress-mental-load',
      'focus-attention',
      'motivation-productivity',
      'sleep-recovery',
      'emotional-wellbeing',
      'digital-overuse',
    ];

    if (validTypes.includes(type)) {
      this.selectedRecommendation = type;
      this.showExerciseModal = true;
    }
  }

  getScoreClass(score: number): string {
    if (score >= 75) return 'score-good';
    if (score >= 50) return 'score-needs-exercises';
    return 'score-see-doctor';
  }

  closeModal(): void {
    this.showExerciseModal = false;
    this.selectedRecommendation = '';
  }
}
