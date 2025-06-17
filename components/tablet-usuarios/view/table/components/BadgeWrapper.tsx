import Badge from "../../../../ux/badge"

export interface BadgeWrapperProps {
    type: "role" | "status"
    value: string
    onClick?: () => void
    className?: string
}

// Configuración de roles con colores basados en la imagen
const ROLE_CONFIG = {
    "ADMIN_DACE": {
        variant: "info" as const,
        label: "Admin DACE",
        color: "#8b5cf6" // Violeta medio
    },
    "ADMIN_FUNDESUR": {
        variant: "warning" as const,
        label: "Admin Fundesur",
        color: "#a855f7" // Violeta más claro
    },
    "SUPER_USUARIO": {
        variant: "success" as const,
        label: "Super Usuario",
        color: "#22c55e" // Verde como en la imagen
    }
} as const

// Configuración de estados con colores basados en la imagen
const STATUS_CONFIG = {
    "ENTREGADO": {
        variant: "success" as const,
        label: "Entregado",
        color: "#22c55e" // Verde brillante
    },
    "LISTO": {
        variant: "info" as const,
        label: "Listo",
        color: "#8b5cf6" // Violeta medio
    },
    "PROCESANDO": {
        variant: "warning" as const,
        label: "Procesando",
        color: "#f97316" // Naranja
    },
    "ACTIVO": {
        variant: "success" as const,
        label: "Activo",
        color: "#22c55e"
    },
    "INACTIVO": {
        variant: "error" as const,
        label: "Inactivo",
        color: "#ef4444"
    }
} as const

// Anchos fijos para consistencia visual
const WIDTHS = {
    role: "110px",
    status: "110px"
} as const

// Type guards para verificar si el valor existe en la configuración
function isValidRoleValue(value: string): value is keyof typeof ROLE_CONFIG {
    return value in ROLE_CONFIG
}

function isValidStatusValue(value: string): value is keyof typeof STATUS_CONFIG {
    return value in STATUS_CONFIG
}

export default function BadgeWrapper({
    type,
    value,
    onClick,
    className = ""
}: BadgeWrapperProps) {
    let itemConfig: { variant: string; label: string; color: string } | null = null

    if (type === "role" && isValidRoleValue(value)) {
        itemConfig = ROLE_CONFIG[value]
    } else if (type === "status" && isValidStatusValue(value)) {
        itemConfig = STATUS_CONFIG[value]
    }

    if (!itemConfig) {
        // Fallback para valores no configurados
        return (
            <Badge
                variant="secondary"
                width={WIDTHS[type]}
                onClick={onClick}
                className={className}
            >
                {value}
            </Badge>
        )
    }

    return (
        <Badge
            variant={itemConfig.variant}
            customColor={itemConfig.color}
            width={WIDTHS[type]}
            onClick={onClick}
            className={className}
        >
            {itemConfig.label}
        </Badge>
    )
}
