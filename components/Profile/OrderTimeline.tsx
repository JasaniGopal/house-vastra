import React from "react";

const STATUS_STEPS = [
  { status: "PENDING", label: "Order Placed", desc: "Confirmed & scheduled for prep." },
  { status: "PREPARING", label: "Custom Tailoring", desc: "Being tailored to your measurements." },
  { status: "DISPATCHED", label: "Dispatched", desc: "On its way to you." },
  { status: "IN_USE", label: "Delivered", desc: "Enjoy your event!" },
  { status: "RETURNED", label: "Returned", desc: "Picked up and returned safely." },
  { status: "COMPLETED", label: "Completed", desc: "Deposit refunded." }
];

export default function OrderTimeline({ currentStatus }: { currentStatus: string }) {
  if (currentStatus === "CANCELLED") {
    return (
      <div className="bg-red-50 text-red-600 p-4 rounded-xl border border-red-100 text-sm font-bold mt-4">
        This order has been cancelled.
      </div>
    );
  }

  const currentIndex = STATUS_STEPS.findIndex(s => s.status === currentStatus);
  const activeIndex = currentIndex === -1 ? 0 : currentIndex;

  return (
    <div className="mt-6 flex flex-col gap-6 relative">
      <div className="absolute left-[11px] top-2 bottom-2 w-0.5 bg-[#E8D8BA]"></div>
      
      {STATUS_STEPS.map((step, idx) => {
        const isCompleted = idx < activeIndex;
        const isActive = idx === activeIndex;
        const isPending = idx > activeIndex;

        return (
          <div key={step.status} className="flex gap-4 relative z-10">
            {isCompleted ? (
              <div className="w-6 h-6 rounded-full bg-[#775a19] flex items-center justify-center shrink-0 mt-0.5 text-white">
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                </svg>
              </div>
            ) : isActive ? (
              <div className="w-6 h-6 rounded-full bg-[#001410] flex items-center justify-center shrink-0 border-4 border-white mt-0.5 shadow-sm">
                <div className="w-2 h-2 rounded-full bg-white"></div>
              </div>
            ) : (
              <div className="w-6 h-6 rounded-full bg-[#FAF2E8] border border-[#A8813C] flex items-center justify-center shrink-0 mt-0.5"></div>
            )}
            
            <div className={isPending ? "opacity-50" : ""}>
              <h4 className={`font-bold text-sm uppercase tracking-wider mb-1 ${isActive ? "text-[#001410]" : "text-zinc-500"}`}>
                {step.label}
              </h4>
              <p className="text-xs text-zinc-500">{step.desc}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
