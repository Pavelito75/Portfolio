import React, { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Timeline } from "../components/ui/timeline";

const Experience: React.FC = () => {
  const { t } = useTranslation();

  const data = useMemo(() => {
    const epitechTasks = t("exp.epitech.tasks", { returnObjects: true }) as string[];
    const assistantTasks = t("exp.assistant.tasks", { returnObjects: true }) as string[];
    const webacademieTasks = t("exp.webacademie.tasks", { returnObjects: true }) as string[];

    return [
      {
        title: "2025 - 2027",
        content: (
          <div className="pb-6">
            <h3 className="text-2xl md:text-3xl font-bold text-cyan-400 mb-3 tracking-tight">
              Epitech
            </h3>
            <p className="text-lg md:text-xl font-semibold mb-6 flex flex-wrap items-center gap-2" style={{ color: 'var(--foreground)' }}>
              {t("exp.epitech.role")} <span className="text-sm font-normal opacity-70">· {t("exp.epitech.period")}</span>
            </p>
            <ul className="space-y-4 ml-5 list-disc" style={{ color: 'var(--text-muted)' }}>
              {Array.isArray(epitechTasks) && epitechTasks.map((task, i) => (
                <li key={i} className="leading-relaxed text-base md:text-lg">{task}</li>
              ))}
            </ul>
          </div>
        ),
      },
      {
        title: "2024 - 2025",
        content: (
          <div className="pb-6">
            <h3 className="text-2xl md:text-3xl font-bold text-cyan-400 mb-3 tracking-tight">
              Epitech
            </h3>
            <p className="text-lg md:text-xl font-semibold mb-6 flex flex-wrap items-center gap-2" style={{ color: 'var(--foreground)' }}>
              {t("exp.assistant.role")} <span className="text-sm font-normal opacity-70">· {t("exp.assistant.period")}</span>
            </p>
            <ul className="space-y-4 ml-5 list-disc" style={{ color: 'var(--text-muted)' }}>
              {Array.isArray(assistantTasks) && assistantTasks.map((task, i) => (
                <li key={i} className="leading-relaxed text-base md:text-lg">{task}</li>
              ))}
            </ul>
          </div>
        ),
      },
      {
        title: "2023 - 2024",
        content: (
          <div className="pb-6">
            <h3 className="text-2xl md:text-3xl font-bold text-cyan-400 mb-3 tracking-tight">
              Web@cadémie by Epitech
            </h3>
            <p className="text-lg md:text-xl font-semibold mb-6 flex flex-wrap items-center gap-2" style={{ color: 'var(--foreground)' }}>
              {t("exp.webacademie.role")} <span className="text-sm font-normal opacity-70">· {t("exp.webacademie.period")}</span>
            </p>
            <ul className="space-y-4 ml-5 list-disc" style={{ color: 'var(--text-muted)' }}>
              {Array.isArray(webacademieTasks) && webacademieTasks.map((task, i) => (
                <li key={i} className="leading-relaxed text-base md:text-lg">{task}</li>
              ))}
            </ul>
          </div>
        ),
      },
    ];
  }, [t]);

  return (
    <section
      id="experience"
      className="py-32 md:py-48 flex flex-col items-center transition-colors duration-300"
      style={{ backgroundColor: 'var(--background)' }}
    >
      <div className="w-full max-w-4xl px-4 md:px-8">
        <Timeline data={data} />
      </div>
    </section>
  );
};

export default Experience;
