import { redirect } from "next/navigation"

/** The app entry point sends visitors to the login screen. */
export default function Page() {
  redirect("/login")
}
