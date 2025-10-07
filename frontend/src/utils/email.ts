export function isEmailValid(email: string): string | undefined {
    const mainParts = email.split('@');
    if (mainParts.length !== 2) {
        return 'Invalid email';
    }
    if (mainParts[1].split('.').length < 2) {
        return `Invalid email domain "${mainParts[1]}"`;
    }
}
