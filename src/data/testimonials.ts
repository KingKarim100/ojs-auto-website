/**
 * Verified customer reviews only. Ships EMPTY on purpose.
 * The testimonials section stays hidden until at least one real review is added here.
 * Never add invented quotes or star ratings.
 */
export interface Testimonial {
  id: string;
  quote: string;
  name: string;
  /** e.g. "Rented a Voxy, March 2027" */
  context: string;
  /** Where the review came from, e.g. "Google review". */
  source: string;
}

export const testimonials: Testimonial[] = [];
