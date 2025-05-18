
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { useEventForm } from "./events/form/useEventForm";
import ImageUploadSection from "./events/form/ImageUploadSection";
import BasicDetailsSection from "./events/form/BasicDetailsSection";
import TicketTypesSection from "./events/form/TicketTypesSection";
import { EventFormValues } from "./events/form/eventFormSchema";

type EventFormProps = {
  event?: any; // Existing event data for editing
  onSuccess: () => void; // Callback on successful submission
};

export default function EventForm({ event, onSuccess }: EventFormProps) {
  const {
    form,
    isSubmitting,
    isDeletingTicket,
    previewImage,
    setPreviewImage,
    handleImageChange,
    addTicketType,
    removeTicketType,
    onSubmit
  } = useEventForm(event, onSuccess);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Banner image upload */}
        <ImageUploadSection 
          previewImage={previewImage}
          handleImageChange={handleImageChange}
          setPreviewImage={setPreviewImage}
          setValue={form.setValue}
        />

        {/* Basic event details */}
        <BasicDetailsSection />

        {/* Ticket Types Section */}
        <TicketTypesSection 
          addTicketType={addTicketType}
          removeTicketType={removeTicketType}
          isDeletingTicket={isDeletingTicket}
        />

        {/* Submit button */}
        <Button 
          type="submit" 
          className="w-full bg-gradient-to-r from-primary to-secondary text-white"
          disabled={isSubmitting}
        >
          {isSubmitting
            ? "Salvando..."
            : event?.id
            ? "Atualizar Evento"
            : "Criar Evento"}
        </Button>
      </form>
    </Form>
  );
}
