import React from 'react';
import Colorfilter from '../components/filter/colorfilter';
import { FiltersSidebar } from '../components/filter/colorbar';


const Filters = () => {
  return (
    <div className="md:px-[100px] grid md:grid-cols-[1fr_2fr] grid-cols-[1fr] gap-4">
      <FiltersSidebar/>
      <Colorfilter />
    </div>
  );
};

export default Filters;
