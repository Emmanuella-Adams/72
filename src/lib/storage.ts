import { LearningTopic, SelfEvaluation, DashboardStats } from "../types";

const LOCAL_STORAGE_KEY = "recallflow_topics_v2"; // upgraded version

const INTERVALS = [1, 3, 7, 14, 30];

export function getTopics(): LearningTopic[] {
  try {
    const data = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (!data) return [];
    return JSON.parse(data);
  } catch (e) {
    console.error("Failed to parse topics from localStorage:", e);
    return [];
  }
}

export function saveTopics(topics: LearningTopic[]): void {
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(topics));
  } catch (e) {
    console.error("Failed to save topics to localStorage:", e);
  }
}

export function createTopic(title: string, notes: string, customQuestions: string[]): LearningTopic {
  const now = new Date();
  
  const topic: LearningTopic = {
    id: Math.random().toString(36).substring(2, 9),
    title: title.trim(),
    notes: notes.trim(),
    explanation: "",
    createdAt: now.toISOString(),
    nextReviewDate: now.toISOString(), // Available immediately
    intervalDays: 1, // Start interval at 1 day
    history: [],
    evaluation: null,
    customPromptQuestions: customQuestions,
  };

  const current = getTopics();
  saveTopics([topic, ...current]);
  return topic;
}

export function updateTopicDetails(id: string, title: string, notes: string, customQuestions: string[]): LearningTopic | null {
  const topics = getTopics();
  const index = topics.findIndex((t) => t.id === id);
  if (index === -1) return null;

  topics[index] = {
    ...topics[index],
    title: title.trim(),
    notes: notes.trim(),
    customPromptQuestions: customQuestions,
  };

  saveTopics(topics);
  return topics[index];
}

export function deleteTopic(id: string): void {
  const topics = getTopics();
  const filtered = topics.filter((t) => t.id !== id);
  saveTopics(filtered);
}

export function submitSelfEvaluation(
  id: string,
  explanation: string,
  evaluation: SelfEvaluation
): LearningTopic | null {
  const topics = getTopics();
  const topicIndex = topics.findIndex((t) => t.id === id);
  if (topicIndex === -1) return null;

  const topic = topics[topicIndex];
  const score = evaluation.score;
  
  // Decide next interval based on score
  let nextInterval: number;
  const currentIndex = INTERVALS.indexOf(topic.intervalDays);
  
  if (score >= 70) {
    // Progress to next interval
    if (currentIndex === -1) {
      nextInterval = 1;
    } else {
      nextInterval = INTERVALS[Math.min(currentIndex + 1, INTERVALS.length - 1)];
    }
  } else {
    // Redo soon: reset to 1 or step back
    if (currentIndex <= 0) {
      nextInterval = 1;
    } else {
      nextInterval = INTERVALS[Math.max(0, currentIndex - 1)];
    }
  }

  const now = new Date();
  const nextDate = new Date();
  nextDate.setDate(now.getDate() + nextInterval);
  nextDate.setHours(0, 0, 0, 0);

  // Archive current evaluation state into history
  const updatedHistory = [...topic.history];
  if (topic.evaluation) {
    updatedHistory.push({
      date: new Date().toISOString(),
      explanation: topic.explanation,
      evaluation: topic.evaluation,
    });
  }

  const updatedTopic: LearningTopic = {
    ...topic,
    explanation,
    evaluation,
    intervalDays: nextInterval,
    nextReviewDate: nextDate.toISOString(),
    history: updatedHistory,
  };

  topics[topicIndex] = updatedTopic;
  saveTopics(topics);
  return updatedTopic;
}

export function getDashboardStats(topics: LearningTopic[]): DashboardStats {
  const totalTopics = topics.length;
  
  const evaluatedTopics = topics.filter((t) => t.evaluation !== null);
  const averageScore =
    evaluatedTopics.length > 0
      ? Math.round(
          evaluatedTopics.reduce((acc, t) => acc + (t.evaluation?.score || 0), 0) /
            evaluatedTopics.length
        )
      : 0;

  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);

  const reviewsDueToday = topics.filter((t) => {
    const reviewDate = new Date(t.nextReviewDate);
    reviewDate.setHours(0, 0, 0, 0);
    return reviewDate.getTime() <= todayStart.getTime();
  }).length;

  return {
    averageScore,
    totalTopics,
    reviewsDueToday,
  };
}
