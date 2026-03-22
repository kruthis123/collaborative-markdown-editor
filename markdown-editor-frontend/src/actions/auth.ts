'use server';

import { SignupFormSchema, LoginFormSchema, FormState } from '@/lib/definitions'
import bcrypt from 'bcryptjs';
import { createSession } from '@/lib/session';
import { prisma } from '@/lib/prisma';
import { redirect } from 'next/navigation';
 
export async function signup(state: FormState, formData: FormData) {
  // Validate form fields
  const validatedFields = SignupFormSchema.safeParse({
    name: formData.get('name'),
    email: formData.get('email'),
    password: formData.get('password'),
  })
 
  // If any form fields are invalid, return early
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    }
  }
 
  const { name, email, password } = validatedFields.data;
  const hashPassword = await bcrypt.hash(password, 10);

  try {
    // Check if user already exists
    const existingUser = await prisma.userProfile.findUnique({
      where: { email }
    });

    if (existingUser) {
      return {
        message: 'An account with this email already exists.',
      }
    }

    // Create user in userprofile table
    const user = await prisma.userProfile.create({
      data: {
        name,
        email,
        password_hash: hashPassword,
      },
    });

    if (!user) {
      return {
        message: 'An error occurred while creating your account.',
      }
    }

    await createSession(user.id.toString());
  } catch (error) {
    console.error('Signup error:', error);
    return {
      message: 'An error occurred while creating your account.',
    }
  }

  redirect('/home');
}

export async function login(state: FormState, formData: FormData) {
  // Validate form fields
  const validatedFields = LoginFormSchema.safeParse({
    email: formData.get('email'),
    password: formData.get('password'),
  })
 
  // If any form fields are invalid, return early
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    }
  }
 
  const { email, password } = validatedFields.data;

  try {
    // Find user by email
    const user = await prisma.userProfile.findUnique({
      where: { email }
    });

    if (!user) {
      return {
        message: 'Invalid email or password.',
      }
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password_hash);

    if (!isPasswordValid) {
      return {
        message: 'Invalid email or password.',
      }
    }

    await createSession(user.id.toString());
  } catch (error) {
    console.error('Login error:', error);
    return {
      message: 'An error occurred while logging in.',
    }
  }

  redirect('/home');
}