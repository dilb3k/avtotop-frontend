'use client';

import { forwardRef, SelectHTMLAttributes } from 'react';
import Select from './Select';

interface CitySelectProps extends Omit<SelectHTMLAttributes<HTMLSelectElement>, 'placeholder'> {
  label?: string;
  error?: string;
}

const UZBEKISTAN_CITIES = [
  'Toshkent', 'Samarqand', 'Buxoro', "Farg'ona", 'Namangan', 'Andijon',
  'Qashqadaryo', 'Surxondaryo', 'Xorazm', 'Navoiy', 'Jizzax', 'Sirdaryo',
  'Qoraqalpog\'iston', 'Nukus', 'Termiz', 'Qarshi', 'Guliston', "Marg'ilon",
  'Kokand', 'Chirchiq', 'Angren', 'Bekobod', 'Xiva', 'Urgench',
];

const CitySelect = forwardRef<HTMLSelectElement, CitySelectProps>(
  (props, ref) => (
    <Select
      ref={ref}
      options={UZBEKISTAN_CITIES.map(c => ({ value: c, label: c }))}
      placeholder="Shaharni tanlang"
      {...props}
    />
  )
);

CitySelect.displayName = 'CitySelect';

export default CitySelect;
