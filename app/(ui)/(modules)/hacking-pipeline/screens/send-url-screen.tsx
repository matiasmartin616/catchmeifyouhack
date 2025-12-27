import SubmitUrlForm from "../components/form/submit-url-form";

export default function SendUrlScreen() {
  return (
    <section className="w-full flex flex-col items-center gap-4 md:gap-8 px-4 md:px-0">
      <p className="text-center text-xs md:text-sm text-green-500/70 max-w-xs md:max-w-md leading-relaxed uppercase tracking-tight">
        Advanced Automated Security Assessment Tool for authorized infiltration testing.
      </p>

      <SubmitUrlForm />
    </section>
  );
}
