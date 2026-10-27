import { createContext, useContext, useMemo, type ReactNode } from 'react';
import { createMockServices, type PortalServices } from './createServices';

const ServicesContext = createContext<PortalServices | null>(null);

export function ServicesProvider({ children }: { children: ReactNode }) {
  const services = useMemo(() => createMockServices(), []);
  return <ServicesContext.Provider value={services}>{children}</ServicesContext.Provider>;
}

export function useServices(): PortalServices {
  const services = useContext(ServicesContext);
  if (!services) {
    throw new Error('ServicesProvider is missing.');
  }
  return services;
}
