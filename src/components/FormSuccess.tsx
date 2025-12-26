// src/components/FormSuccess.tsx
import { CheckCircle2 } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface FormSuccessProps {
    message?: string;
}

export function FormSuccess({ message }: FormSuccessProps) {
    if (!message) return null;

    return (
        <Alert className="border-green-200 bg-green-50">
            <CheckCircle2 className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800">{message}</AlertDescription>
        </Alert>
    );
}