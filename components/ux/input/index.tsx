"use client"
import React, { useState, useRef, useEffect, forwardRef, useImperativeHandle } from 'react'
import Icon from '../icon'
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa6";
import './input.css';

interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'type'> {
    className?: string;
    name: string;
    type: 'password' | 'text' | 'email' | 'date' | 'number' | 'tel' | 'url';
    icon?: React.ReactNode;
    id?: string;
    required?: boolean;
    disabled?: boolean;
    max?: number;
    min?: number;
    hasContentState?: boolean;
    placeholder: string;
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
    value?: string;
    defaultValue?: string;
    error?: string;
    helperText?: string;
    label?: string;
    'aria-label'?: string;
    'aria-describedby'?: string;
}

export interface InputRef {
    focus: () => void;
    blur: () => void;
    getValue: () => string;
    setValue: (value: string) => void;
}

const Input = forwardRef<InputRef, InputProps>(({
    className = "",
    icon,
    name,
    id = name,
    type,
    required = false,
    disabled = false,
    min,
    max,
    hasContentState = false,
    placeholder,
    onChange,
    value,
    defaultValue,
    error,
    helperText,
    label,
    'aria-label': ariaLabel,
    'aria-describedby': ariaDescribedBy,
    ...restProps
}, ref) => {

    const [isFocused, setIsFocused] = useState(false);
    const [inputType, setInputType] = useState(type);
    const [hasContent, setHasContent] = useState(hasContentState);
    const inputRef = useRef<HTMLInputElement>(null);

    // Determinar si es un input controlado
    const isControlled = value !== undefined;

    useImperativeHandle(ref, () => ({
        focus: () => inputRef.current?.focus(),
        blur: () => inputRef.current?.blur(),
        getValue: () => inputRef.current?.value || '',
        setValue: (newValue: string) => {
            if (inputRef.current) {
                inputRef.current.value = newValue;
                setHasContent(newValue !== "");
            }
        }
    }));

    const togglePasswordVisibility = () => {
        setInputType(prev => prev === "password" ? "text" : "password");
    };

    const handleClick = () => {
        if (type === 'date' && inputRef.current && !disabled) {
            inputRef.current.showPicker();
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = e.target.value;
        setHasContent(newValue !== "");
        onChange?.(e);
    };

    const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
        setIsFocused(true);
        if (type === 'date') setInputType('date');
        restProps.onFocus?.(e);
    };

    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
        setIsFocused(false);
        if (type === 'date') setInputType('text');
        restProps.onBlur?.(e);
    };

    useEffect(() => {
        if (inputRef.current) {
            const initialValue = isControlled ? (value || '') : (inputRef.current.value || '');
            setHasContent(initialValue !== "");
        }
    }, [value, isControlled]);

    // IDs únicos para accesibilidad
    const errorId = error ? `${id}-error` : undefined;
    const helperTextId = helperText ? `${id}-helper` : undefined;
    const describedBy = [ariaDescribedBy, errorId, helperTextId].filter(Boolean).join(' ') || undefined;

    return (
        <div className={`input-wrapper ${className}`}>
            {/* Label opcional */}
            {label && (
                <label htmlFor={id} className="input-label">
                    {label}
                    {required && <span className="required-indicator" aria-label="requerido">*</span>}
                </label>
            )}

            <div
                className={`container-input ${isFocused ? "focus" : ""} ${icon ? "" : "no-icon"} ${error ? "error" : ""} ${disabled ? "disabled" : ""}`}
                onClick={handleClick}
            >
                {/* Icono */}
                {icon && (
                    <div className='label-ico' aria-hidden="true">
                        <Icon icon={icon} />
                    </div>
                )}

                {/* Input */}
                <input
                    ref={inputRef}
                    type={inputType}
                    name={name}
                    id={id}
                    required={required}
                    disabled={disabled}
                    value={isControlled ? value : undefined}
                    defaultValue={!isControlled ? defaultValue : undefined}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                    onChange={handleChange}
                    aria-label={ariaLabel || (label ? undefined : placeholder)}
                    aria-describedby={describedBy}
                    aria-invalid={error ? 'true' : 'false'}
                    {...(min !== undefined ? { min } : {})}
                    {...(max !== undefined ? { max } : {})}
                    {...restProps}
                />

                {/* Toggle de contraseña */}
                {type === "password" && (
                    <button
                        className="view-pass"
                        type="button"
                        onClick={togglePasswordVisibility}
                        disabled={disabled}
                        aria-label={inputType === "password" ? "Mostrar contraseña" : "Ocultar contraseña"}
                        tabIndex={-1}
                    >
                        <Icon icon={inputType === "password" ? <FaRegEye /> : <FaRegEyeSlash />} />
                    </button>
                )}

                {/* Placeholder flotante */}
                <span
                    className={`holder ${hasContent || isFocused ? "has-content" : ""}`}
                    aria-hidden="true"
                >
                    {placeholder}
                </span>
            </div>

            {/* Mensajes de error y ayuda */}
            {error && (
                <div id={errorId} className="error-message" role="alert" aria-live="polite">
                    {error}
                </div>
            )}

            {helperText && !error && (
                <div id={helperTextId} className="helper-text">
                    {helperText}
                </div>
            )}
        </div>
    );
});

Input.displayName = 'Input';

export default Input;
