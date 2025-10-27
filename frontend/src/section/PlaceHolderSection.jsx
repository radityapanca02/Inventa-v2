import { IconPackage, IconUsers, IconClipboardList } from '@tabler/icons-react';

const PlaceholderSection = ({ title, icon: Icon, description }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
      <div className="glassmorphism p-8 rounded-2xl max-w-md">
        <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Icon className="w-8 h-8 text-primary-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">{title}</h2>
        <p className="text-gray-600 mb-6">{description}</p>
        <div className="animate-pulse text-sm text-gray-500">
          Fitur akan segera hadir...
        </div>
      </div>
    </div>
  );
};

export default PlaceholderSection;