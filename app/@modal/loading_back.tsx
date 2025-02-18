import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { Loader } from "@/components/ui/loader";

export default async function RouteLoading() {
  return (
    <Dialog open={true}>
      <DialogContent className="flex items-center justify-center bg-card px-4 py-8">
        <DialogTitle className="sr-only">Loading...</DialogTitle>
        <DialogDescription className="sr-only">
          Please wait while we are loading your data.
        </DialogDescription>
        <Loader />
      </DialogContent>
    </Dialog>
  );
}
