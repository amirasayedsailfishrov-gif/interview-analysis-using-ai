import re
from collections import Counter
from textblob import TextBlob
from deep_translator import GoogleTranslator
import math

def analyze_sentiment(transcript):
    sentiments = {"positive": 0, "neutral": 0, "negative": 0}
    total = len(transcript)

    for item in transcript:
        try:
            translated = GoogleTranslator(source='ar', target='en').translate(item['text'])
            polarity = TextBlob(translated).sentiment.polarity
            if polarity > 0.1:
                sentiments["positive"] += 1
            elif polarity < -0.1:
                sentiments["negative"] += 1
            else:
                sentiments["neutral"] += 1
        except:
            sentiments["neutral"] += 1

    for k in sentiments:
        sentiments[k] = f"{round((sentiments[k] / total) * 100, 2)}%"
    return sentiments

def analyze_psychological_patterns(transcript):
    """تحليل نفسي متقدم للأنماط السلوكية والشخصية"""
    text = " ".join([item['text'] for item in transcript])
    total_words = len(text.split())
    
    # مؤشرات نفسية
    confidence_indicators = ["أعتقد", "أؤكد", "متأكد", "بالتأكيد", "بثقة", "أعرف", "مقتنع"]
    uncertainty_indicators = ["ربما", "قد", "ممكن", "لا أعرف", "غير متأكد", "أظن", "يبدو"]
    stress_indicators = ["توتر", "قلق", "خوف", "ضغط", "مشكلة", "صعب", "مؤلم", "أزمة"]
    emotional_words = ["حب", "فرح", "حزن", "غضب", "خوف", "أمل", "يأس", "سعادة"]
    
    confidence_score = sum(1 for word in confidence_indicators if word in text)
    uncertainty_score = sum(1 for word in uncertainty_indicators if word in text)
    stress_level = sum(1 for word in stress_indicators if word in text)
    emotional_intensity = sum(1 for word in emotional_words if word in text)
    
    # تحليل سرعة الكلام النفسية
    speech_rate = calculate_overall_speech_rate(transcript)
    
    psychological_profile = {
        "confidence_level": min(100, (confidence_score / max(1, uncertainty_score)) * 20),
        "stress_indicators": stress_level,
        "emotional_stability": max(0, 100 - (stress_level * 10)),
        "communication_clarity": min(100, (total_words / len(transcript)) * 5) if len(transcript) > 0 else 0,
        "speech_pattern": {
            "rate": speech_rate,
            "pattern_type": "متسارع" if speech_rate > 2.5 else "بطيء" if speech_rate < 1.5 else "طبيعي",
            "psychological_meaning": get_speech_pattern_meaning(speech_rate)
        }
    }
    
    return psychological_profile

def get_speech_pattern_meaning(rate):
    """تفسير نفسي لسرعة الكلام"""
    if rate > 3.0:
        return "سرعة عالية جداً - قد تشير إلى توتر أو حماس شديد"
    elif rate > 2.5:
        return "سرعة عالية - يدل على نشاط ذهني وثقة بالنفس"
    elif rate > 2.0:
        return "سرعة طبيعية مرتفعة - شخصية نشطة ومتفاعلة"  
    elif rate > 1.5:
        return "سرعة طبيعية - توازن جيد في التواصل"
    elif rate > 1.0:
        return "سرعة منخفضة - قد يشير إلى التأني والتفكير العميق"
    else:
        return "سرعة منخفضة جداً - قد يشير إلى تردد أو قلق"

def analyze_deception_indicators(transcript):
    """تحليل مؤشرات الخداع والصدق"""
    deception_words = [
        "في الواقع", "صدقني", "بصراحة", "والله", "أقسم", 
        "لا أكذب", "حقيقة", "أؤكد لك", "بالفعل", "حقاً"
    ]
    
    hesitation_patterns = [
        "آآآ", "إممم", "يعني", "كيف أقول", "أقصد", 
        "بمعنى", "أي", "ألا وهو", "كما تعلم"
    ]
    
    text = " ".join([item['text'] for item in transcript])
    
    deception_score = sum(1 for word in deception_words if word in text)
    hesitation_score = sum(1 for pattern in hesitation_patterns if pattern in text)
    
    # تحليل التكرار المفرط
    word_frequency = Counter(text.split())
    repetition_score = sum(1 for count in word_frequency.values() if count > 5)
    
    credibility_analysis = {
        "deception_indicators": deception_score,
        "hesitation_patterns": hesitation_score,
        "repetition_score": repetition_score,
        "credibility_rating": max(0, 100 - (deception_score * 5 + hesitation_score * 3 + repetition_score * 2)),
        "analysis_notes": get_credibility_notes(deception_score, hesitation_score, repetition_score)
    }
    
    return credibility_analysis

def get_credibility_notes(deception, hesitation, repetition):
    """تقديم ملاحظات حول المصداقية"""
    notes = []
    
    if deception > 3:
        notes.append("استخدام مفرط لكلمات التأكيد قد يشير إلى محاولة إقناع")
    if hesitation > 5:
        notes.append("وجود تردد واضح في الكلام")
    if repetition > 3: 
        notes.append("تكرار مفرط لبعض الكلمات قد يدل على توتر")
    
    if not notes:
        notes.append("أنماط كلام طبيعية دون مؤشرات واضحة على الخداع")
        
    return notes

def analyze_personality_traits(transcript):
    """تحليل سمات الشخصية الخمس الكبرى"""
    text = " ".join([item['text'] for item in transcript])
    
    # الانفتاح على التجربة
    openness_words = ["جديد", "مختلف", "إبداع", "فكرة", "تجربة", "مغامرة", "تغيير"]
    
    # الضمير الحي
    conscientiousness_words = ["منظم", "دقيق", "مسؤول", "الوقت", "خطة", "هدف", "إنجاز"]
    
    # الانبساط
    extraversion_words = ["اجتماع", "ناس", "أصدقاء", "حفلة", "نشاط", "طاقة", "متحمس"]
    
    # الوداعة
    agreeableness_words = ["مساعدة", "تعاون", "لطيف", "صبر", "تفهم", "احترام", "سلام"]
    
    # العصابية
    neuroticism_words = ["قلق", "توتر", "خوف", "حزن", "غضب", "ضغط", "مشكلة"]
    
    traits = {
        "openness": sum(1 for word in openness_words if word in text),
        "conscientiousness": sum(1 for word in conscientiousness_words if word in text), 
        "extraversion": sum(1 for word in extraversion_words if word in text),
        "agreeableness": sum(1 for word in agreeableness_words if word in text),
        "neuroticism": sum(1 for word in neuroticism_words if word in text)
    }
    
    # تحويل إلى نسب مئوية
    total_indicators = sum(traits.values()) or 1
    personality_profile = {
        trait: round((score / total_indicators) * 100, 1) 
        for trait, score in traits.items()
    }
    
    # إضافة تفسيرات
    personality_profile["dominant_trait"] = max(personality_profile.items(), key=lambda x: x[1])
    personality_profile["personality_summary"] = get_personality_summary(personality_profile)
    
    return personality_profile

def get_personality_summary(profile):
    """ملخص الشخصية بناءً على التحليل"""
    dominant = profile["dominant_trait"][0]
    
    summaries = {
        "openness": "شخصية منفتحة على التجارب الجديدة ومبدعة",
        "conscientiousness": "شخصية منظمة ومسؤولة وملتزمة",
        "extraversion": "شخصية اجتماعية ونشطة ومتفاعلة",
        "agreeableness": "شخصية ودودة ومتعاونة ومتفهمة", 
        "neuroticism": "شخصية حساسة وقد تحتاج لإدارة الضغوط"
    }
    
    return summaries.get(dominant, "شخصية متوازنة")

def translate_to_english(transcript):
    """ترجمة النص العربي إلى الإنجليزية الفعلية"""
    translations = []
    for t in transcript:
        try:
            # ترجمة النص العربي إلى الإنجليزية
            translated_text = GoogleTranslator(source='ar', target='en').translate(t['text'])
            translations.append({
                "start": t["start"],
                "end": t["end"],
                "arabic_text": t['text'],  # النص العربي الأصلي
                "english_text": translated_text  # الترجمة الإنجليزية
            })
        except Exception as e:
            print(f"Translation error: {e}")
            # في حالة فشل الترجمة، احتفظ بالنص الأصلي مع ملاحظة
            translations.append({
                "start": t["start"], 
                "end": t["end"],
                "arabic_text": t['text'],
                "english_text": f"[Translation failed] Please check internet connection"
            })
    return translations

def analyze_word_repetition(transcript):
    """تحليل تكرار الكلام وما يدل عليه نفسياً"""
    text = " ".join([item['text'] for item in transcript])
    words = text.split()
    word_frequency = Counter(words)
    
    # تحليل التكرار
    total_words = len(words)
    unique_words = len(set(words))
    repetition_ratio = (total_words - unique_words) / total_words if total_words > 0 else 0
    
    # الكلمات الأكثر تكراراً
    most_repeated = word_frequency.most_common(10)
    
    # تحليل أنماط التكرار
    excessive_repetition = [word for word, count in word_frequency.items() if count > 5 and len(word) > 2]
    
    # التفسير النفسي للتكرار
    psychological_meaning = get_repetition_psychological_meaning(repetition_ratio, excessive_repetition)
    
    return {
        "repetition_ratio": round(repetition_ratio * 100, 2),
        "total_words": total_words,
        "unique_words": unique_words,
        "most_repeated_words": most_repeated,
        "excessive_repetition": excessive_repetition,
        "psychological_analysis": psychological_meaning,
        "repetition_level": get_repetition_level(repetition_ratio)
    }

def get_repetition_psychological_meaning(ratio, excessive_words):
    """التفسير النفسي لتكرار الكلام"""
    meanings = []
    
    if ratio > 0.4:  # تكرار عالي
        meanings.append("تكرار عالي قد يشير إلى:")
        meanings.append("• توتر أو قلق شديد")
        meanings.append("• محاولة التأكيد على نقطة معينة")
        meanings.append("• نقص في المفردات أو صعوبة في التعبير")
        
    elif ratio > 0.25:  # تكرار متوسط
        meanings.append("تكرار متوسط قد يدل على:")
        meanings.append("• رغبة في الوضوح والتأكيد")
        meanings.append("• تفكير منظم ومتسلسل")
        meanings.append("• حرص على إيصال المعنى بدقة")
        
    else:  # تكرار منخفض
        meanings.append("تكرار منخفض يشير إلى:")
        meanings.append("• ثراء في المفردات")
        meanings.append("• ثقة في التعبير")
        meanings.append("• تنوع في أساليب الكلام")
    
    # تحليل الكلمات المكررة بإفراط
    if len(excessive_words) > 3:
        meanings.append("\nكلمات مكررة بإفراط:")
        for word in excessive_words[:5]:
            meanings.append(f"• '{word}' - قد يشير إلى تركيز مفرط على موضوع معين")
    
    return meanings

def get_repetition_level(ratio):
    """تحديد مستوى التكرار"""
    if ratio > 0.4:
        return "عالي"
    elif ratio > 0.25:
        return "متوسط"
    elif ratio > 0.15:
        return "طبيعي"
    else:
        return "منخفض"

def count_total_words(transcript):
    return sum(len(item['text'].split()) for item in transcript)
    return sum(len(item['text'].split()) for item in transcript)

def get_frequent_words(transcript, top_n=10):
    text = " ".join([item['text'] for item in transcript])
    # إزالة الكلمات الشائعة
    stop_words = ["في", "من", "على", "إلى", "عن", "مع", "هذا", "هذه", "ذلك", "التي", "الذي", "و", "أن", "لا", "ما", "كان", "كانت"]
    words = [word for word in re.findall(r'\b\w+\b', text) if word not in stop_words and len(word) > 2]
    counter = Counter(words)
    return counter.most_common(top_n)

def calculate_overall_speech_rate(transcript):
    total_words = sum(len(item['text'].split()) for item in transcript)
    total_duration = sum(item['end'] - item['start'] for item in transcript)
    return total_words / total_duration if total_duration > 0 else 0.0

def detect_sensitive_words(transcript, sensitive_words=None):
    if sensitive_words is None:
        sensitive_words = [
            "تهديد", "سلاح", "خيانة", "تفجير", "اغتيال", "قتل",
            "عنف", "إرهاب", "مؤامرة", "اعتداء", "انفجار", "رصاص",
            "هجوم", "كمين", "حرب", "صراع", "دمار", "ذبح", "مسدس",
            "مجزرة", "موت", "مهاجمة", "تفخيخ", "قنص", "عدوان",
            "خطف", "ابتزاز", "جريمة", "دماء", "إصابة", "معركة",
            "قنبلة", "عبوة ناسفة", "اجتياح", "عصابة", "تحريض"
        ]
    alerts = []
    for item in transcript:
        for word in sensitive_words:
            if word in item['text']:
                alerts.append({
                    "start": item["start"],
                    "end": item["end"],
                    "word": word,
                    "text": item['text']
                })
    return alerts

def generate_comprehensive_report(analysis_data, transcript):
    """إنشاء تقرير شامل للتحليل النفسي والجنائي باللغة العربية"""
    
    # حساب المؤشرات الرئيسية
    speech_rate = analysis_data.get('speech_rate_wps', 0)
    total_words = analysis_data.get('total_words', 0)
    sentiment = analysis_data.get('sentiment', {})
    repetition_data = analysis_data.get('word_repetition_analysis', {})
    
    positive_pct = float(sentiment.get('positive', '0%').replace('%', ''))
    negative_pct = float(sentiment.get('negative', '0%').replace('%', ''))
    
    report = {
        "executive_summary": f"""
📋 الملخص التنفيذي للتحليل النفسي والجنائي:

🔍 البيانات الأساسية:
• تم تحليل عينة صوتية تحتوي على {total_words} كلمة
• معدل الكلام: {speech_rate:.2f} كلمة في الثانية
• نسبة المشاعر الإيجابية: {positive_pct}%
• نسبة المشاعر السلبية: {negative_pct}%
• نسبة تكرار الكلمات: {repetition_data.get('repetition_ratio', 0)}%

🎯 التقييم الشامل:
{'✅ شخصية متفائلة ومستقرة نفسياً' if positive_pct > 60 else '⚠️ يحتاج لدعم نفسي ومتابعة' if negative_pct > 40 else '📊 شخصية متوازنة نسبياً'}

🧠 نمط الشخصية المهيمن:
{get_personality_classification(positive_pct, negative_pct, speech_rate)}
        """,
        
        "speech_pattern_analysis": {
            "rate_analysis": get_arabic_speech_analysis(speech_rate),
            "consistency_rating": "متسق ومنتظم" if 1.5 <= speech_rate <= 2.5 else "غير منتظم وقد يشير لتوتر",
            "psychological_indicators": get_speech_psychological_indicators(speech_rate),
            "forensic_assessment": get_forensic_speech_assessment(speech_rate)
        },
        
        "repetition_analysis": {
            "overview": f"مستوى التكرار: {repetition_data.get('repetition_level', 'غير محدد')}",
            "psychological_meaning": repetition_data.get('psychological_analysis', []),
            "excessive_words": repetition_data.get('excessive_repetition', []),
            "interpretation": get_repetition_interpretation(repetition_data.get('repetition_ratio', 0))
        },
        
        "emotional_stability": {
            "overall_rating": get_emotional_stability_rating(negative_pct),
            "risk_assessment": get_risk_assessment(negative_pct, speech_rate),
            "recommendations": get_emotional_recommendations(negative_pct, positive_pct)
        },
        
        "psychological_profile": {
            "communication_style": get_arabic_communication_style(speech_rate, total_words),
            "dominant_traits": get_arabic_dominant_traits(positive_pct, negative_pct, speech_rate),
            "behavioral_indicators": get_behavioral_indicators(analysis_data),
            "personality_assessment": get_personality_assessment(positive_pct, negative_pct)
        },
        
        "forensic_analysis": {
            "credibility_assessment": get_credibility_assessment(analysis_data),
            "deception_indicators": get_deception_summary(analysis_data),
            "interview_suitability": calculate_interview_suitability(analysis_data),
            "risk_factors": identify_risk_factors(analysis_data)
        },
        
        "final_recommendations": {
            "psychological_development": get_psychological_recommendations(positive_pct, negative_pct, speech_rate),
            "communication_improvement": get_communication_recommendations(speech_rate, repetition_data),
            "professional_suitability": get_professional_assessment(analysis_data),
            "follow_up_suggestions": get_followup_suggestions(analysis_data)
        }
    }
    
    return report

def get_personality_classification(positive, negative, rate):
    """تصنيف الشخصية الرئيسي"""
    if positive > 70 and rate > 2.0:
        return "شخصية قيادية واثقة ومتفائلة"
    elif positive > 60 and negative < 20:
        return "شخصية مستقرة وإيجابية"
    elif negative > 40:
        return "شخصية تحتاج لدعم نفسي"
    elif rate < 1.5:
        return "شخصية حذرة ومتأنية"
    elif rate > 2.8:
        return "شخصية متحمسة وقد تكون متوترة"
    else:
        return "شخصية متوازنة ومتكيفة"

def get_arabic_speech_analysis(rate):
    """تحليل سرعة الكلام بالعربية"""
    if rate > 3.0:
        return "سرعة مفرطة - قد تشير إلى توتر شديد أو محاولة إخفاء معلومات"
    elif rate > 2.5:
        return "سرعة عالية - شخص واثق ونشط، لكن قد يحتاج لتهدئة الإيقاع"
    elif rate > 2.0:
        return "معدل ممتاز - يدل على ثقة وطلاقة في التعبير"
    elif rate > 1.5:
        return "معدل طبيعي - يشير إلى تأني وتفكير قبل الكلام"
    else:
        return "بطء في الكلام - قد يشير إلى تردد أو حذر مفرط"

def get_speech_psychological_indicators(rate):
    """المؤشرات النفسية لسرعة الكلام"""
    indicators = []
    
    if rate > 2.8:
        indicators.extend([
            "مؤشرات التوتر والقلق",
            "رغبة في الانتهاء بسرعة", 
            "قد يخفي معلومات مهمة"
        ])
    elif rate > 2.2:
        indicators.extend([
            "ثقة عالية بالنفس",
            "طلاقة في التعبير",
            "شخصية اجتماعية"
        ])
    elif rate < 1.5:
        indicators.extend([
            "حذر في اختيار الكلمات",
            "تفكير عميق قبل الكلام",
            "قد يشير للتردد أو الخوف"
        ])
    else:
        indicators.extend([
            "توازن نفسي جيد",
            "قدرة على التحكم في الذات",
            "تفكير منطقي ومنظم"
        ])
    
    return indicators

def get_forensic_speech_assessment(rate):
    """التقييم الجنائي لأنماط الكلام"""
    if rate > 3.0:
        return "⚠️ مؤشر خطر عالي - سرعة مفرطة قد تخفي معلومات"
    elif rate < 1.2:
        return "⚠️ مؤشر حذر - بطء مفرط قد يشير لكذب أو إخفاء"
    elif 1.8 <= rate <= 2.3:
        return "✅ نمط طبيعي - لا توجد مؤشرات خداع واضحة"
    else:
        return "📊 يحتاج متابعة - أنماط غير معتادة تستدعي التحقق"

def get_repetition_interpretation(ratio):
    """تفسير نسبة التكرار نفسياً"""
    if ratio > 15:
        return "تكرار مفرط - قد يشير إلى القلق أو محاولة الإقناع بالقوة"
    elif ratio > 10:
        return "تكرار عالي - قد يدل على التأكيد أو عدم الثقة في الرسالة"
    elif ratio > 5:
        return "تكرار طبيعي - يستخدم للتأكيد والوضوح"
    else:
        return "تكرار منخفض - كلام متنوع ومتدفق"

def get_emotional_stability_rating(negative_pct):
    """تقييم الاستقرار العاطفي"""
    if negative_pct < 15:
        return "مستقر عاطفياً بدرجة ممتازة"
    elif negative_pct < 25:
        return "مستقر عاطفياً بدرجة جيدة"
    elif negative_pct < 40:
        return "استقرار عاطفي متوسط"
    else:
        return "يحتاج لدعم في الاستقرار العاطفي"

def get_risk_assessment(negative_pct, speech_rate):
    """تقييم مستوى المخاطر"""
    risk_score = 0
    
    if negative_pct > 50:
        risk_score += 3
    elif negative_pct > 30:
        risk_score += 2
    elif negative_pct > 15:
        risk_score += 1
    
    if speech_rate > 3.5 or speech_rate < 1.0:
        risk_score += 2
    elif speech_rate > 3.0 or speech_rate < 1.2:
        risk_score += 1
    
    if risk_score >= 4:
        return "مخاطر عالية - يحتاج تدخل فوري"
    elif risk_score >= 2:
        return "مخاطر متوسطة - يحتاج متابعة"
    else:
        return "مخاطر منخفضة - حالة طبيعية"

def get_emotional_recommendations(negative_pct, positive_pct):
    """توصيات للاستقرار العاطفي"""
    recommendations = []
    
    if negative_pct > 40:
        recommendations.extend([
            "ضرورة استشارة نفسية متخصصة",
            "تطبيق تقنيات الاسترخاء والتأمل",
            "ممارسة الرياضة والأنشطة الإيجابية"
        ])
    elif negative_pct > 25:
        recommendations.extend([
            "تطوير آليات إدارة الضغط",
            "تحسين أنماط التفكير الإيجابي"
        ])
    
    if positive_pct > 70:
        recommendations.append("الاستفادة من الطاقة الإيجابية في القيادة")
    
    return recommendations

def get_arabic_communication_style(speech_rate, total_words):
    """تحليل أسلوب التواصل"""
    if speech_rate > 2.5 and total_words > 100:
        return "متحدث طلق وواثق - يفضل التفصيل"
    elif speech_rate > 2.2:
        return "متحدث نشط - يحب المشاركة"
    elif speech_rate < 1.8:
        return "متحدث متأني - يفكر قبل الكلام"
    else:
        return "متحدث متوازن - أسلوب مناسب"

def get_arabic_dominant_traits(positive_pct, negative_pct, speech_rate):
    """الصفات المهيمنة في الشخصية"""
    traits = []
    
    if positive_pct > 60:
        traits.append("متفائل وإيجابي")
    if speech_rate > 2.3:
        traits.append("نشط وحيوي")
    if negative_pct < 20:
        traits.append("مستقر نفسياً")
    if speech_rate < 1.8:
        traits.append("حذر ومتأني")
    if speech_rate > 2.8:
        traits.append("متحمس وقد يكون متوتر")
    
    return traits if traits else ["شخصية متوازنة"]

def get_behavioral_indicators(analysis_data):
    """مؤشرات سلوكية"""
    indicators = []
    speech_rate = analysis_data.get('speech_rate_wps', 0)
    sentiment = analysis_data.get('sentiment', {})
    
    if speech_rate > 3.0:
        indicators.append("قد يكون تحت ضغط أو توتر")
    if float(sentiment.get('negative', '0%').replace('%', '')) > 30:
        indicators.append("يظهر علامات عدم الراحة")
    
    return indicators

def get_personality_assessment(positive_pct, negative_pct):
    """تقييم شامل للشخصية"""
    if positive_pct > 70 and negative_pct < 15:
        return "شخصية قوية ومتفائلة - مناسبة للأدوار القيادية"
    elif positive_pct > 50 and negative_pct < 25:
        return "شخصية متوازنة - قادرة على التكيف"
    elif negative_pct > 40:
        return "تحتاج لتطوير الجانب النفسي والعاطفي"
    else:
        return "شخصية طبيعية ومقبولة"

def get_credibility_assessment(analysis_data):
    """تقييم المصداقية"""
    speech_rate = analysis_data.get('speech_rate_wps', 0)
    
    if 1.8 <= speech_rate <= 2.5:
        return "مصداقية عالية - أنماط كلام طبيعية"
    elif speech_rate > 3.0 or speech_rate < 1.2:
        return "تحتاج للتحقق - أنماط غير عادية"
    else:
        return "مصداقية متوسطة"

def get_deception_summary(analysis_data):
    """ملخص مؤشرات الخداع"""
    deception_indicators = analysis_data.get('deception_indicators', {})
    risk_level = deception_indicators.get('risk_level', 'منخفض')
    
    return f"مستوى المخاطر: {risk_level}"

def calculate_interview_suitability(analysis_data):
    """حساب مناسبة المقابلة"""
    speech_rate = analysis_data.get('speech_rate_wps', 0)
    sentiment = analysis_data.get('sentiment', {})
    positive_pct = float(sentiment.get('positive', '0%').replace('%', ''))
    
    score = 0
    if 1.5 <= speech_rate <= 2.8:
        score += 3
    if positive_pct > 50:
        score += 2
    
    if score >= 4:
        return "ممتاز للمقابلات"
    elif score >= 2:
        return "مناسب للمقابلات"
    else:
        return "يحتاج تحضير إضافي"

def identify_risk_factors(analysis_data):
    """تحديد عوامل المخاطر"""
    risks = []
    speech_rate = analysis_data.get('speech_rate_wps', 0)
    sentiment = analysis_data.get('sentiment', {})
    negative_pct = float(sentiment.get('negative', '0%').replace('%', ''))
    
    if speech_rate > 3.5:
        risks.append("سرعة كلام مفرطة")
    if negative_pct > 50:
        risks.append("مشاعر سلبية عالية")
    
    return risks if risks else ["لا توجد مخاطر واضحة"]

def get_psychological_recommendations(positive_pct, negative_pct, speech_rate):
    """توصيات التطوير النفسي"""
    recommendations = []
    
    if negative_pct > 30:
        recommendations.append("العمل على تحسين الحالة المزاجية")
    if speech_rate > 3.0:
        recommendations.append("تطوير مهارات الهدوء والتركيز")
    if positive_pct < 40:
        recommendations.append("تعزيز الثقة بالنفس")
    
    return recommendations

def get_communication_recommendations(speech_rate, repetition_data):
    """توصيات تحسين التواصل"""
    recommendations = []
    
    if speech_rate > 2.8:
        recommendations.append("تقليل سرعة الكلام للوضوح")
    if repetition_data.get('repetition_ratio', 0) > 12:
        recommendations.append("تقليل تكرار الكلمات")
    
    return recommendations

def get_professional_assessment(analysis_data):
    """التقييم المهني"""
    speech_rate = analysis_data.get('speech_rate_wps', 0)
    sentiment = analysis_data.get('sentiment', {})
    positive_pct = float(sentiment.get('positive', '0%').replace('%', ''))
    
    if positive_pct > 60 and 1.8 <= speech_rate <= 2.5:
        return "مناسب للأدوار المهنية المتقدمة"
    elif positive_pct > 40:
        return "مناسب للأدوار المهنية العادية"
    else:
        return "يحتاج تطوير مهني"

def evaluate_response_quality(text):
    """تقييم جودة الاستجابة - العمق والخصوصية"""
    score = 0

    # كلمات العمق
    depth_keywords = ["تحليل", "أثبت", "ناقش", "استنتج", "يفسر", "مقارنة", "تقييم", "أسباب", "نتائج", "أدلة"]
    
    # كلمات الخصوصية
    specificity_keywords = ["تحديدًا", "بالضبط", "تشير الأبحاث", "في عام", "حسب دراسة",
                           "في مجال", "وفقًا لـ", "تجربة", "اسم باحث", "نوع معين", "مكان معين"]

    # تقييم العمق
    if any(word in text for word in depth_keywords):
        score += 0.5

    # تقييم الخصوصية
    if any(word in text for word in specificity_keywords):
        score += 0.5

    # تقييمات إضافية
    # وجود أمثلة
    if "مثال" in text or "مثل" in text:
        score += 0.15

    # الطول وعدد الجمل
    if len(text.split('.')) > 4:
        score += 0.15

    # وجود كلمات تحليلية
    if any(w in text for w in ["تحليل", "أثبت", "استنتج", "ناقش"]):
        score += 0.2

    # التخصص أو ذكر مجال محدد
    if any(w in text for w in ["مجال", "موضوع", "تخصص"]):
        score += 0.15

    # دقة/خصوصية
    if any(w in text for w in ["بالضبط", "تحديدًا", "على وجه التحديد", "بالتفصيل"]):
        score += 0.15

    # ترابط ووضوح
    if any(w in text for w in ["لذلك", "بالتالي", "علاوة على ذلك", "من ناحية أخرى"]):
        score += 0.2

    final_score = round(min(score, 1.0), 2)
    
    if final_score >= 0.8:
        level = "ممتاز"
    elif final_score >= 0.6:
        level = "جيد جداً"  
    elif final_score >= 0.4:
        level = "جيد"
    else:
        level = "يحتاج تحسين"
        
    return {
        "score": final_score,
        "level": level,
        "depth_indicators": [word for word in depth_keywords if word in text],
        "specificity_indicators": [word for word in specificity_keywords if word in text]
    }

def analyze_hesitation_patterns(text):
    """تحليل أنماط التردد وكلمات الحشو"""
    import re
    from collections import Counter
    
    # كلمات الحشو والتردد الشائعة في العربية
    filler_words = ["يعني", "هو", "بس", "كده", "اه", "ايوة", "طيب", "خلاص", "ما هو", "يا إما"]
    hesitation_patterns = ["ممم", "اااه", "هممم", "إيه", "ازاي", "يعني كده"]
    
    # تنظيف النص
    text_clean = re.sub(r'[^\w\s]', '', text.lower())
    words = text_clean.split()
    
    # حساب كلمات الحشو
    filler_count = {}
    total_fillers = 0
    for word in filler_words:
        count = words.count(word)
        if count > 0:
            filler_count[word] = count
            total_fillers += count
    
    # حساب أنماط التردد
    hesitation_count = {}
    total_hesitations = 0
    for pattern in hesitation_patterns:
        count = text.lower().count(pattern)
        if count > 0:
            hesitation_count[pattern] = count
            total_hesitations += count
    
    # حساب النسب
    total_words = len(words)
    filler_ratio = (total_fillers / total_words * 100) if total_words > 0 else 0
    hesitation_ratio = (total_hesitations / total_words * 100) if total_words > 0 else 0
    
    # تقييم المستوى
    if filler_ratio > 15:
        fluency_level = "متردد جداً"
    elif filler_ratio > 8:
        fluency_level = "متردد"
    elif filler_ratio > 3:
        fluency_level = "متردد قليلاً"
    else:
        fluency_level = "طلق"
    
    return {
        "filler_words": filler_count,
        "hesitation_patterns": hesitation_count,
        "filler_ratio": round(filler_ratio, 2),
        "hesitation_ratio": round(hesitation_ratio, 2),
        "fluency_level": fluency_level,
        "total_fillers": total_fillers,
        "total_hesitations": total_hesitations
    }

def detect_soft_skills(text):
    """كشف المهارات الناعمة"""
    
    soft_skills_keywords = {
        "التواصل": ["تواصل", "إقناع", "استماع", "عرض", "شرح", "نقاش", "حوار", "توضيح"],
        "القيادة": ["قيادة", "توجيه", "إلهام", "إدارة", "تحفيز", "ريادة", "مسؤولية"],
        "العمل الجماعي": ["فريق", "تعاون", "تنسيق", "جماعي", "مشترك", "شراكة"],
        "حل المشكلات": ["حل", "مشكلة", "تحدي", "تحليل", "حلول", "معالجة"],
        "التفكير النقدي": ["تفكير", "نقد", "منطق", "أدلة", "تقييم", "استنتاج"],
        "إدارة الوقت": ["تنظيم", "وقت", "جدول", "التزام", "أولوية", "تخطيط"],
        "المرونة": ["تأقلم", "مرونة", "ظروف", "تغيير", "تكيف", "استجابة"],
        "الإبداع": ["ابتكار", "إبداع", "أفكار", "خارج الصندوق", "خلاقة", "مبتكر"]
    }
    
    found_skills = {}
    skill_scores = {}
    
    for skill, keywords in soft_skills_keywords.items():
        skill_keywords_found = []
        for keyword in keywords:
            if keyword in text:
                skill_keywords_found.append(keyword)
        
        if skill_keywords_found:
            found_skills[skill] = skill_keywords_found
            # حساب درجة القوة بناءً على عدد الكلمات المكتشفة
            skill_scores[skill] = len(skill_keywords_found) / len(keywords)
    
    return {
        "detected_skills": found_skills,
        "skill_scores": skill_scores,
        "skills_count": len(found_skills)
    }

def measure_engagement_level(text):
    """قياس مستوى المشاركة والحماس"""
    
    high_engagement_keywords = ['لماذا', 'كيف', 'هل يمكن', 'أعتقد', 'برأيي', 'اقتراح', 'سؤال', 'نقاش', 'ما رأيكم']
    medium_engagement_keywords = ['جميل', 'مفيد', 'شكرا', 'ممتاز', 'رائع', 'أحببت', 'موافق']
    low_engagement_keywords = ['.', '...', 'نعم', 'لا']
    
    text_lower = text.lower()
    
    high_score = sum(1 for word in high_engagement_keywords if word in text_lower)
    medium_score = sum(1 for word in medium_engagement_keywords if word in text_lower)
    low_score = sum(1 for word in low_engagement_keywords if word in text_lower)
    
    total_indicators = high_score + medium_score + low_score
    
    if high_score > 0:
        level = "مشاركة عالية"
        score = 0.8 + (high_score * 0.05)
    elif medium_score > 0:
        level = "مشاركة متوسطة"
        score = 0.5 + (medium_score * 0.05)
    else:
        level = "مشاركة منخفضة"
        score = 0.2
    
    return {
        "engagement_level": level,
        "engagement_score": min(round(score, 2), 1.0),
        "high_engagement_count": high_score,
        "medium_engagement_count": medium_score,
        "low_engagement_count": low_score,
        "engagement_indicators": {
            "high": [word for word in high_engagement_keywords if word in text_lower],
            "medium": [word for word in medium_engagement_keywords if word in text_lower],
            "low": [word for word in low_engagement_keywords if word in text_lower]
        }
    }

def get_followup_suggestions(analysis_data):
    """اقتراحات المتابعة"""
    return [
        "إعادة تقييم بعد 3 أشهر",
        "تطبيق التوصيات المقترحة",
        "متابعة التحسن في المؤشرات"
    ]

def get_forensic_speech_analysis(rate):
    """تحليل جنائي لأنماط الكلام"""
    if rate > 3.0:
        return "سرعة مفرطة - قد تشير إلى توتر أو محاولة إخفاء معلومات"
    elif rate > 2.5:
        return "سرعة طبيعية عالية - شخص واثق ومرتاح"
    elif rate > 2.0:
        return "معدل طبيعي - لا توجد مؤشرات غير طبيعية"
    elif rate > 1.5:
        return "معدل منخفض - قد يشير إلى حذر أو تفكير عميق"
    else:
        return "بطء مفرط - قد يشير إلى تردد أو إخفاء معلومات"

def get_communication_style(rate, words):
    """تحديد نمط التواصل"""
    if rate > 2.3 and words > 150:
        return "متحدث بارع وواثق"
    elif rate < 1.7 and words < 100:
        return "متحدث حذر ومختصر"
    elif words > 200:
        return "متحدث مفصل ومعبر"
    else:
        return "متحدث متوازن"

def get_dominant_traits(positive, negative, rate):
    """تحديد السمات المهيمنة"""
    traits = []
    
    if positive > 60:
        traits.append("متفائل")
    if negative < 20:
        traits.append("مستقر عاطفياً")
    if rate > 2.2:
        traits.append("نشط ومتفاعل")
    if rate < 1.8:
        traits.append("متأني ومدروس")
    
    return traits if traits else ["متوازن"]

def get_psychological_recommendations(positive, negative, rate):
    """توصيات نفسية للتطوير"""
    recommendations = []
    
    if negative > 30:
        recommendations.append("العمل على تقنيات إدارة الضغوط والاسترخاء")
    if rate > 2.8:
        recommendations.append("ممارسة التنفس العميق لتهدئة معدل الكلام")
    if rate < 1.5:
        recommendations.append("تطوير الثقة بالنفس من خلال التدريب")
    if positive < 40:
        recommendations.append("العمل على تحسين النظرة الإيجابية للحياة")
    
    return recommendations if recommendations else ["الحفاظ على الأداء الحالي الجيد"]

def calculate_interview_score(positive, negative, rate):
    """حساب درجة ملائمة المقابلة"""
    score = 0
    
    # درجة الإيجابية (40 نقطة)
    score += min(40, positive * 0.67)
    
    # تخصم للسلبية (20 نقطة)
    score += max(0, 20 - negative * 0.5)
    
    # درجة معدل الكلام (40 نقطة) 
    if 1.5 <= rate <= 2.5:
        score += 40
    elif 1.2 <= rate <= 2.8:
        score += 30
    else:
        score += 20
        
    return min(100, round(score))

def get_interview_strengths(positive, rate):
    """نقاط القوة في المقابلة"""
    strengths = []
    
    if positive > 60:
        strengths.append("موقف إيجابي ومتفائل")
    if 1.8 <= rate <= 2.3:
        strengths.append("معدل كلام مثالي للتواصل")
    if rate > 2.0:
        strengths.append("ثقة واضحة في التعبير")
        
    return strengths if strengths else ["قدرة على التعبير الأساسية"]

def get_improvement_areas(negative, rate):
    """مجالات التحسين"""
    areas = []
    
    if negative > 25:
        areas.append("إدارة المشاعر السلبية والتوتر")
    if rate > 2.7:
        areas.append("تهدئة معدل الكلام للوضوح")
    if rate < 1.5:
        areas.append("زيادة الثقة والحيوية في التعبير")
        
    return areas if areas else ["مواصلة التطوير المستمر"]

def analyze_all(transcript):
    """التحليل الشامل مع جميع المكونات الجديدة"""
    # تحويل النص إلى نص مفرد للدوال الجديدة
    combined_text = " ".join([item['text'] for item in transcript])
    
    basic_analysis = {
        "sentiment": analyze_sentiment(transcript),
        "total_words": count_total_words(transcript),
        "frequent_words": get_frequent_words(transcript),
        "speech_rate_wps": calculate_overall_speech_rate(transcript),
        "sensitive_words": detect_sensitive_words(transcript),
        "translation": translate_to_english(transcript)
    }
    
    # إضافة التحليلات المتقدمة
    basic_analysis["psychological_analysis"] = analyze_psychological_patterns(transcript)
    basic_analysis["deception_analysis"] = analyze_deception_indicators(transcript)
    basic_analysis["personality_traits"] = analyze_personality_traits(transcript)
    basic_analysis["word_repetition_analysis"] = analyze_word_repetition(transcript)
    
    # إضافة التحليلات الجديدة باستخدام النص المدمج
    basic_analysis["response_quality"] = evaluate_response_quality(combined_text)
    basic_analysis["hesitation_patterns"] = analyze_hesitation_patterns(combined_text)
    basic_analysis["soft_skills"] = detect_soft_skills(combined_text)
    basic_analysis["engagement_level"] = measure_engagement_level(combined_text)
    
    # التقرير الشامل
    basic_analysis["comprehensive_report"] = generate_comprehensive_report(basic_analysis, transcript)
    
    return basic_analysis
