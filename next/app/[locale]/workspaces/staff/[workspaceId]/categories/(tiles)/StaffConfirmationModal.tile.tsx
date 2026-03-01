"use client";

import { BlockPrimitive } from '@/app/primitives/Block.primitive';

interface StaffConfirmationModalTileProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    message: string;
}

export function StaffConfirmationModalTile({ isOpen, onClose, onConfirm, message }: StaffConfirmationModalTileProps) {
    if (!isOpen) return null;

    return (
        <BlockPrimitive variant="modal">
            <BlockPrimitive variant="default">
                <p>{message}</p>
                <div className="flex justify-end gap-2 mt-4">
                    <button onClick={onClose} className="px-4 py-2 border rounded text-black">
                        Cancel
                    </button>
                    <button onClick={onConfirm} className="px-4 py-2 border rounded bg-blue-500 text-white">
                        Confirm
                    </button>
                </div>
            </BlockPrimitive>
        </BlockPrimitive>
    );
}
