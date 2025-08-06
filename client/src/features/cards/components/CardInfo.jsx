import React from "react";
import { CardField } from "./CardField";
import CardMetaInfo from "./CardMetaInfo";
import FieldCard from "./FieldCard"; // Extracted FieldCard component
import {
  TagIcon,
  FolderIcon,
  DocumentTextIcon,
  InformationCircleIcon,
  HashtagIcon,
} from "@heroicons/react/24/solid";

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
