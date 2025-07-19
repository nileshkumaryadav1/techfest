// app/api/auth/[...nextauth]/route.js
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import connectDB from "@/utils/db";
import Student from "@/models/Student";
import bcrypt from "bcrypt";

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text", placeholder: "you@example.com" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        await connectDB();

        const { email, password } = credentials || {};

        if (!email || !password) {
          throw new Error("Email and password are required.");
        }

        const student = await Student.findOne({ email: email.toLowerCase() });

        if (!student) {
          throw new Error("Invalid email or password.");
        }

        const isPasswordValid = await bcrypt.compare(password, student.password);
        if (!isPasswordValid) {
          throw new Error("Invalid email or password.");
        }

        return {
          id: student._id.toString(),
          name: student.name,
          email: student.email,
          role: student.role,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, student }) {
      if (student) {
        token.id = student.id;
        token.role = student.role;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.student.id = token.id;
        session.student.role = token.role;
      }
      return session;
    },
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: "/login",
    error: "/login",
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
