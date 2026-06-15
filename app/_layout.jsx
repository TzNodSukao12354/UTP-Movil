import AsyncStorage from "@react-native-async-storage/async-storage";
import { Stack, usePathname, useRouter } from "expo-router";
import { useEffect } from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";

export default function RootLayout() {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const verificarSesion = async () => {
      try {
        const userId = await AsyncStorage.getItem("userId");
        const rutasRegistro = [
          "/login",
          "/genero",
          "/intereses",
          "/carrera",
          "/usuario",
        ];
        const esRutaRegistro = rutasRegistro.includes(pathname);

        // Descomenta esto cuando tengas el backend conectado:
        // if (!userId && !esRutaRegistro) {
        //   router.replace("/login");
        // } else if (userId && esRutaRegistro) {
        //   router.replace("/inicio/inicio");
        // }
      } catch (error) {
        console.error("Error verificando sesión:", error);
      }
    };
    verificarSesion();
  }, [pathname]);

  return (
    // SafeAreaProvider es OBLIGATORIO para que useSafeAreaInsets
    // funcione en todos los componentes hijos
    <SafeAreaProvider>
      <Stack screenOptions={{ headerShown: false }} />
    </SafeAreaProvider>
  );
}
