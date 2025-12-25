export class TechStackEntity {
  constructor(
    public server: string | null,
    public technologies: string[],
    public headers: Record<string, string>
  ) {}
}
