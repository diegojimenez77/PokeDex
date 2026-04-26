import { Route, Routes } from 'react-router-dom';
import { AppShell } from './components/AppShell.jsx';
import { Landing } from './pages/Landing.jsx';
import { Explore } from './pages/Explore.jsx';
import { PokemonDetail } from './pages/PokemonDetail.jsx';
import { Favorites } from './pages/Favorites.jsx';

export default function App() {
  return (
    <Routes>
      <Route element={<AppShell />}>
        <Route path="/" element={<Landing />} />
        <Route path="/explorar" element={<Explore />} />
        <Route path="/pokemon/:id" element={<PokemonDetail />} />
        <Route path="/favoritos" element={<Favorites />} />
      </Route>
    </Routes>
  );
}
