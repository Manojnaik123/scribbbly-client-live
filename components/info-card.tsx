import { InfoCardProps } from "@/lib/comp-props/info-card-props";


export default function InfoCard({ title, accentColor, borderColor, children }: InfoCardProps) {
  return (
    <div className={`bg-card-background border-2 ${borderColor} shadow-[4px_4px_0_#000] p-5 flex flex-col gap-3 h-full`}>
      <h2 className={`font-['Press_Start_2P'] text-[11px] ${accentColor} border-b-2 ${borderColor} pb-2`}>
        {title}
      </h2>
      <div className="flex-1  font-['Press_Start_2P'] text-[7px] text-muted leading-6">
        {children}
      </div>
    </div>
  )
}