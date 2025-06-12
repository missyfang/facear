/**
 * Strongly typed button component, reusable button component
 */
type ButtonProps = {
    label: string;
    onClick: () => void;
};

export const Button = ({ label, onClick }: ButtonProps) => {
    return (
        <button onClick={onClick} className="btn">
            {label}
        </button>
    );
}