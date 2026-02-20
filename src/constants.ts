import { SurveyData, MAJORS, ATTACK_VECTORS, VIGILANCE_LEVELS, TRUST_FACTORS, PASSWORD_RISKS, AWARENESS_IMPACTS } from './types';

// Generating 1700 mock responses with highly disparate logic as requested
const generateMockData = (): SurveyData[] => {
  const data: SurveyData[] = [];
  for (let i = 1; i <= 1700; i++) {
    const major = MAJORS[Math.floor(Math.random() * MAJORS.length)];
    const isCyber = major === "الأمن السيبراني";
    const isTech = ["هندسة البرمجيات", "نظم المعلومات", "علوم الحاسب"].includes(major);
    
    // 1. Vigilance Level (Checked Link) - "No, didn't cross my mind" is dominant
    let checkedLink;
    const randVig = Math.random();
    if (isCyber) {
      checkedLink = randVig > 0.2 ? "نعم دائماً" : (randVig > 0.1 ? "أحياناً" : "لا لم يخطر ببالي");
    } else if (isTech) {
      checkedLink = randVig > 0.5 ? "نعم دائماً" : (randVig > 0.3 ? "أحياناً" : "لا لم يخطر ببالي");
    } else {
      // Non-tech: "No, didn't cross my mind" is dominant (~70%)
      checkedLink = randVig > 0.9 ? "نعم دائماً" : (randVig > 0.7 ? "أحياناً" : "لا لم يخطر ببالي");
    }

    // 2. Password Risk - "Yes, in most sites" is dominant (~60%)
    let samePassword;
    const randPass = Math.random();
    if (isCyber) {
      samePassword = randPass > 0.9 ? "لا" : (randPass > 0.8 ? "في بعض المواقع فقط" : "لا");
    } else {
      // General population: ~60% "Yes, in most sites"
      samePassword = randPass > 0.4 ? "نعم في أغلب المواقع" : (randPass > 0.2 ? "في بعض المواقع فقط" : "لا");
    }

    // 3. Trust Factor (UI/UX Impact) - "No, it looked very official" is ~75%
    let expectedAwareness;
    const randTrust = Math.random();
    if (isCyber) {
      expectedAwareness = randTrust > 0.5 ? "لا بدا رسمياً جداً" : (randTrust > 0.2 ? "شككت قليلاً" : "نعم التصميم مريب");
    } else {
      // ~75% "No, it looked very official"
      expectedAwareness = randTrust > 0.25 ? "لا بدا رسمياً جداً" : (randTrust > 0.1 ? "شككت قليلاً" : "نعم التصميم مريب");
    }

    // 4. Attack Vector Success
    let attackVector;
    const randVec = Math.random();
    if (major === "التسويق" || major === "إدارة الأعمال") {
      attackVector = randVec > 0.5 ? "واتساب" : "QR Code";
    } else {
      // Filter out Snapchat from the selection
      const availableVectors = ATTACK_VECTORS.filter(v => v !== "سناب شات");
      attackVector = availableVectors[Math.floor(Math.random() * availableVectors.length)];
    }

    // 5. Awareness Impact - "Yes, definitely" should be dominant after the experiment (~85%)
    let willBeMoreCareful;
    const randImpact = Math.random();
    if (randImpact > 0.15) {
      willBeMoreCareful = "نعم بكل تأكيد";
    } else if (randImpact > 0.05) {
      willBeMoreCareful = "سأحاول الانتباه أكثر";
    } else {
      willBeMoreCareful = "سأفعل التحقق الثنائي";
    }

    data.push({
      id: i,
      major,
      attackVector,
      checkedLink,
      expectedAwareness,
      samePassword,
      willBeMoreCareful,
    });
  }
  return data;
};

export const MOCK_DATA = generateMockData();
