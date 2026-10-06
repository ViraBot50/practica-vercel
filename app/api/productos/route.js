import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET() {
  const { data, error } = await supabase
    .from('productos')
    .select('*')
    .order('id', { ascending: true });

  if (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }

  return NextResponse.json(data);
}

export async function POST(request) {
  try {
    const body = await request.json();

    const { nombre, precio, descripcion } = body;

    if (!nombre || precio === undefined) {
      return NextResponse.json(
        { error: "Nombre y precio son obligatorios" },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from("productos")
      .insert([
        {
          nombre,
          precio,
          descripcion,
        },
      ])
      .select()
      .single();

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json(data, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Datos inválidos" },
      { status: 400 }
    );
  }
}