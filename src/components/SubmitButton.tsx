// src/components/SubmitButton.tsx
'use client';

import {useFormStatus} from "react-dom";
import {Button} from "@/components/ui/button";

export function SubmitButton() {
    const { pending } = useFormStatus();

    return (
        <Button
            type="submit"
            size="lg"
            className="w-full h-12 text-lg font-semibold"
            disabled={pending}
        >
            {pending ? 'Entrando...' : 'Entrar no sistema'}
        </Button>
    );
}