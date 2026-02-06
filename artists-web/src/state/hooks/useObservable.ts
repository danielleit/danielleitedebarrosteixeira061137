"use client";

import { useEffect, useState } from 'react';
import { Observable } from 'rxjs';

/**
 * Hook para observar BehaviorSubject e renderizar componente quando houver mudanças.
 */
export function useObservable<T>(source$: Observable<T>, initialValue: T): T {
  const [value, setValue] = useState<T>(initialValue);

  useEffect(() => {
    const subscription = source$.subscribe((val) => setValue(val));
    return () => subscription.unsubscribe();
  }, [source$]);

  return value;
}
