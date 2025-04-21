import React from 'react';
import { Dialog } from '@headlessui/react';
import { X } from 'lucide-react';
import { RentalForm } from './RentalForm';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  itemId: string;
  pricePerDay: number;
  startDate: string;
  endDate: string;
}

export function BookingModal({ isOpen, onClose, itemId, pricePerDay, startDate, endDate }: BookingModalProps) {
  const handleSuccess = () => {
    onClose();
    // You might want to show a success message or redirect
  };

  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      className="relative z-50"
    >
      {/* Background overlay */}
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />

      {/* Full-screen container to center the panel */}
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="mx-auto max-w-xl w-full bg-white rounded-xl shadow-lg">
          <div className="flex justify-between items-center p-6 border-b">
            <Dialog.Title className="text-xl font-semibold">
              Book Your Rental
            </Dialog.Title>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500"
            >
              <X size={24} />
            </button>
          </div>

          <div className="p-6">
            <RentalForm
              itemId={itemId}
              pricePerDay={pricePerDay}
              onSuccess={handleSuccess}
              onCancel={onClose}
              availableStartDate={startDate}
              availableEndDate={endDate}
            />
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
} 