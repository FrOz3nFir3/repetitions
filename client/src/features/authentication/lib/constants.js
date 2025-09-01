import {
  EyeIcon,
  ClockIcon,
  PlusCircleIcon,
  PencilSquareIcon,
  ChartBarIcon,
  UserCircleIcon,
  FireIcon,
} from "@heroicons/react/24/outline";

export const guestFeatures = [
  {
    icon: EyeIcon,
    title: "View Cards",
    description: "Browse and access existing flashcards",
    available: true,
  },
  {
    icon: ClockIcon,
    title: "Take Quizzes",
    description: "Practice with spaced repetition",
    available: true,
  },
  {
    icon: PlusCircleIcon,
    title: "Create Cards",
    description: "Build your own flashcard collections",
    available: false,
  },
  {
    icon: PencilSquareIcon,
    title: "Edit Cards",
    description: "Modify and improve existing cards",
    available: false,
  },
  {
    icon: ChartBarIcon,
    title: "Track Progress",
    description: "View detailed performance analytics",
    available: false,
  },
  {
    icon: FireIcon,
    title: "Focus Review / Quiz Sessions",
    description:
      "Focused learning sessions based upon your feedback / performance",
    available: false,
  },
  {
    icon: UserCircleIcon,
    title: "Activity Timeline",
    description: "See your contributions and history",
    available: false,
  },
];

export const memberFeatures = [
  {
    icon: EyeIcon,
    title: "View Cards",
    description: "Browse and access all flashcards",
    available: true,
  },
  {
    icon: ClockIcon,
    title: "Take Quizzes",
    description: "Practice with advanced spaced repetition",
    available: true,
  },
  {
    icon: PlusCircleIcon,
    title: "Create Cards",
    description: "Build unlimited flashcard collections",
    available: true,
  },
  {
    icon: PencilSquareIcon,
    title: "Edit Cards",
    description: "Modify any cards with attribution",
    available: true,
  },
  {
    icon: ChartBarIcon,
    title: "Track Progress",
    description: "Detailed analytics and performance insights",
    available: true,
  },
  {
    icon: FireIcon,
    title: "Focus Review / Quiz Sessions",
    description:
      "Focused learning sessions based upon your feedback / performance",
    available: true,
  },
  {
    icon: UserCircleIcon,
    title: "Activity Timeline",
    description: "Your Username appears in edit history",
    available: true,
  },
];
