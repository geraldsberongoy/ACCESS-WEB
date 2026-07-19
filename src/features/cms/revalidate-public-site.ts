import { revalidatePath } from "next/cache";

export function revalidatePublicSite() {
  revalidatePath("/");
  revalidatePath("/", "page");
  revalidatePath("/", "layout");
}
