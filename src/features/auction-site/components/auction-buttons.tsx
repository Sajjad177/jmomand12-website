import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type Props = React.ComponentProps<typeof Button>;

export function AuctionPrimaryButton({ className, ...props }: Props) {
  return (
    <Button
      className={cn(
        "h-10 rounded-[4px] bg-[#fe6819] px-6 text-sm font-bold text-white shadow-[0_5px_15px_rgba(37,44,97,0.15),0_2px_4px_rgba(136,144,194,0.2)] hover:bg-[#ef5f0c]",
        className,
      )}
      {...props}
    />
  );
}

export function AuctionOutlineButton({ className, ...props }: Props) {
  return (
    <Button
      className={cn(
        "h-10 rounded-[4px] border border-[#fe6819] bg-white px-6 text-sm font-bold text-[#fe6819] shadow-[0_5px_15px_rgba(37,44,97,0.15),0_2px_4px_rgba(136,144,194,0.2)] hover:bg-[#fff3eb]",
        className,
      )}
      {...props}
    />
  );
}
