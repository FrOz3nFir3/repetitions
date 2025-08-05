import React from "react";
import { CardField } from "./CardField";
import CardMetaInfo from "./CardMetaInfo";
import {
  TagIcon,
  FolderIcon,
  DocumentTextIcon,
  InformationCircleIcon,
  HashtagIcon,
} from "@heroicons/react/24/solid";

const FieldCard = ({ icon: Icon, title, children, color = "blue" }) => {
  const colorClasses = {
    blue: "from-blue-500 to-cyan-600 border-blue-200 dark:border-blue-700",
    green:
      "from-green-500 to-emerald-600 border-green-200 dark:border-green-700",
    orange:
      "from-orange-500 to-amber-600 border-orange-200 dark:border-orange-700",
    purple:
      "from-purple-500 to-violet-600 border-purple-200 dark:border-purple-700",
    gray: "from-gray-500 to-slate-600 border-gray-200 dark:border-gray-700",
  };

  return (
    <div
      className={`bg-white dark:bg-gray-800 rounded-xl shadow-lg border-l-4 ${colorClasses[color]} hover:shadow-xl transition-all duration-300 group`}
    >
      <div className="p-5">
        <div className="flex items-center gap-3 mb-4">
          <div
            className={`p-2 bg-gradient-to-r ${colorClasses[color]} rounded-lg shadow-md group-hover:scale-110 transition-transform duration-300`}
          >
            <Icon className="h-5 w-5 text-white" />
          </div>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
            {title}
          </h3>
        </div>
        <div className="ml-1">{children}</div>
      </div>
    </div>
  );
};

const CardInfo = ({ card }) => {
  const {
    _id,
    "main-topic": mainTopic,
    "sub-topic": subTopic,
    description = "",
    category,
  } = card;

  return (
    <div className="bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 rounded-2xl p-6">
      {/* Header */}
      <div className="mb-8 pb-6 border-b border-gray-200 dark:border-gray-700">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
          Card Information
        </h2>
        <p className="text-gray-600 dark:text-gray-400 text-sm">
          Manage your Card details and metadata.
        </p>
      </div>

      {/* Card Fields */}
      <div className="space-y-6">
        <FieldCard icon={HashtagIcon} title="Main Topic" color="blue">
          <CardField _id={_id} text="main-topic" value={mainTopic} />
        </FieldCard>

        <FieldCard icon={TagIcon} title="Sub Topic" color="green">
          <CardField _id={_id} text="sub-topic" value={subTopic} />
        </FieldCard>

        <FieldCard icon={FolderIcon} title="Category" color="orange">
          <CardField _id={_id} text="category" value={category} />
        </FieldCard>

        <FieldCard icon={DocumentTextIcon} title="Description" color="purple">
          <CardField _id={_id} text="description" value={description} />
        </FieldCard>

        <FieldCard icon={InformationCircleIcon} title="Metadata" color="gray">
          <CardMetaInfo card={card} />
        </FieldCard>
      </div>
    </div>
  );
};

export default CardInfo;
