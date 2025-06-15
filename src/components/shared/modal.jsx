/** @jsxImportSource @emotion/react */
import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { css, useTheme } from '@emotion/react';

const modalRoot = document.getElementById('modal-root') || document.body;

export default function Modal({ children, onClose }) {
    const theme = useTheme();

    // Close on ESC
    useEffect(() => {
        const handleKey = e => { if (e.key === 'Escape') onClose(); };
        document.addEventListener('keydown', handleKey);
        return () => document.removeEventListener('keydown', handleKey);
    }, [onClose]);

    // Prevent background scroll
    useEffect(() => {
        document.body.style.overflow = 'hidden';
        return () => { document.body.style.overflow = ''; };
    }, []);

    return createPortal(
        <div
            className="fixed inset-0 flex items-center justify-center z-50"
            css={css`
                background-color: transparent;
            `}
            onClick={onClose}
        >
            <div
                className="rounded-lg shadow-lg max-w-lg w-full p-6 relative"
                css={css`
                    background-color: ${theme.colors.background};
                    border: 1px solid ${theme.colors.secondary};
                    color: ${theme.colors.text};
                `}
                onClick={e => e.stopPropagation()}
            >
                {/* Close button */}
                <button
                    onClick={onClose}
                    className="absolute top-2 right-2"
                    css={css`
                        background: transparent;
                        border: none;
                        font-size: 1.5rem;
                        color: ${theme.colors.textMid};
                        cursor: pointer;
                    `}
                >
                    &times;
                </button>
                {children}
            </div>
        </div>,
        modalRoot
    );
}