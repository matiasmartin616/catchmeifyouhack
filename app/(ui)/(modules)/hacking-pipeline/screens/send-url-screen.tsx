import SubmitUrlForm from "../components/form/submit-url-form";

export default function SendUrlScreen() {
  return (
    <section className="w-full flex flex-col items-center gap-8">
      <p className="text-center text-sm text-green-500/70 max-w-md leading-relaxed uppercase tracking-tight">
        Advanced Automated Security Assessment Tool for authorized infiltration testing.
      </p>

      <SubmitUrlForm />
    </section>
  );
}
