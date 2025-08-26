import { Routes, Route } from 'react-router-dom';
import SalesView from './SalesView';
import SaleForm from './SaleForm';

export default function SalesRoutes() {
  return (
    <Routes>
      <Route path="/" element={<SalesView />} />
      <Route path="/crear" element={<SaleForm />} />
      <Route path="/editar/:id" element={<SaleForm />} />
    </Routes>
  );
}