import { useState, useEffect } from 'react';
import { prisma } from '../lib/prisma';
import { useCallback } from 'react';

export interface PageConfig {
  heroTitle: string;
  heroSubtitle: string;
  heroImage: string;
  accentColor: string;
  primaryColor: string;
  footerText: string;
  contactEmail: string;
  contactPhone: string;
  contactAddress: string;
  bankAccountInfo: string;
}

const DEFAULT_CONFIG: PageConfig = {
  heroTitle: 'INGENIERÍA QUE CONSTRUYE EL FUTURO',
  heroSubtitle: 'Soluciones integrales en diseño, cálculo y ejecución de obras civiles con los más altos estándares de calidad.',
  heroImage: 'https://images.unsplash.com/photo-1541888946425-d81bb19480c5?auto=format&fit=crop&q=80',
  accentColor: '#EAB308',
  primaryColor: '#0A0A0A',
  footerText: '© 2024 CONSTRUM&S. Todos los derechos reservados.',
  contactEmail: 'info@construms.com',
  contactPhone: '+502 1234 5678',
  contactAddress: 'Ciudad de Guatemala, Guatemala',
  bankAccountInfo: 'Banco Industrial - Cuenta Monetaria: 123-456789-0 - A nombre de: CONSTRUM&S S.A.'
};

export const usePageConfig = () => {
  const [config, setConfig] = useState<PageConfig>(DEFAULT_CONFIG);
  const [loading, setLoading] = useState(true);

  const fetchConfig = useCallback(async () => {
    setLoading(true);
    try {
      // Busca el registro de configuración en la tabla Config
      const configDb = await prisma.config.findUnique({ where: { id: 'site' } });
      if (configDb) {
        setConfig({ ...DEFAULT_CONFIG, ...configDb });
      }
    } catch (error) {
      console.error('Error cargando configuración de página:', error);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchConfig();
  }, [fetchConfig]);

  return { config, loading };
};
