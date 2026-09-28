import { useState } from 'react';

export default function Tabs({
  tabs = [],
  defaultTab,
  onChange,
  className = '',
}) {
  const [activeTab, setActiveTab] = useState(defaultTab || tabs[0]?.id);

  const handleTabClick = (tabId) => {
    setActiveTab(tabId);
    onChange?.(tabId);
  };

  const activeContent = tabs.find((t) => t.id === activeTab)?.content;

  return (
    <div className={className}>
      {/* Tab List */}
      <div className="border-b border-slate-200 dark:border-slate-800" role="tablist">
        <nav className="flex gap-0 -mb-px overflow-x-auto scrollbar-none">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              role="tab"
              aria-selected={activeTab === tab.id}
              onClick={() => handleTabClick(tab.id)}
              className={`
                px-4 py-2.5 text-sm font-medium
                border-b-2 transition-colors duration-150
                whitespace-nowrap cursor-pointer
                ${activeTab === tab.id
                  ? 'border-primary-600 text-primary-600 dark:border-primary-400 dark:text-primary-400 font-semibold'
                  : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:border-slate-300 dark:hover:border-slate-700'
                }
              `}
            >
              <span className="flex items-center gap-2">
                {tab.icon && <tab.icon size={16} />}
                {tab.label}
                {tab.count !== undefined && (
                  <span
                    className={`
                      text-xs px-1.5 py-0.5 rounded-full font-medium
                      ${activeTab === tab.id
                        ? 'bg-primary-100 dark:bg-primary-950 text-primary-700 dark:text-primary-300'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                      }
                    `}
                  >
                    {tab.count}
                  </span>
                )}
              </span>
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Panel */}
      <div role="tabpanel" className="pt-4">
        {activeContent}
      </div>
    </div>
  );
}
