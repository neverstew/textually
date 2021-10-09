import type v4 from "$lib/generateUserKey";
import supabase from "$lib/supabase";
import type { RequestHandler } from "@sveltejs/kit";
import { createHash } from "crypto";

export const get: RequestHandler = async ({ params }) => {
  const { userKey } = params

  let { user, error, session } = await supabase.auth.signUp({
    email: `${userKey}@example.com`,
    password: genPassword(userKey)
  })

  if (!error?.message.includes('Thanks for registering')) {
    console.error(error)
    return {
      status: 401,
      body: {
        name: error.name,
        message: error.message,
      }
    }
  }

  const signInData = await supabase.auth.signIn({
    email: `${userKey}@example.com`,
    password: genPassword(userKey)
  })

  user = signInData.user
  session = signInData.session
  error = signInData.error
  if (error) {
    console.error(error)

    return {
      status: 401,
      body: {
        name: error.name,
        message: error.message,
      }
    }
  }

  return {
    status: 201,
    body: {
      user: JSON.stringify(user),
      refreshToken: session.refresh_token,
    },
  }
}

function genPassword(id: ReturnType<typeof v4>) {
  return createHash('md5').update(import.meta.env.VITE_SALT as string).update(id).digest('hex')
}