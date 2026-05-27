import Registro from "./Registro";
import Login from "./Login";
import logoUrl from "../logo.svg";

export default function Auth({ vista, cambiarVista, onLogin }) {
  return (
    <div className="min-h-screen bg-[#eef2ff] p-3">
      <h3 className="text-lg font-semibold text-gray-300">
        Registro e Inicio de Sesión - CampusLend
      </h3>

      <div className="mx-auto mt-28 flex min-h-[560px] w-[92%] max-w-6xl overflow-hidden rounded-2xl bg-gray-50 shadow-xl max-md:mt-10 max-md:flex-col">
        <div className="w-1/2 bg-[#00543D] text-white max-md:w-full">
          <div className="flex h-full min-h-[360px] flex-col justify-between bg-gradient-to-br from-[#00543D] to-[#003d2c] p-10">
            <div className="flex items-center gap-2">
              <img src={logoUrl} alt="CampusLend" className="h-8 w-auto brightness-0 invert" />
            </div>

            <div>
              <h1 className="mb-5 text-5xl font-bold leading-tight max-md:text-4xl">
                Share more.
                <br />
                Spend less.
              </h1>
              <p className="max-w-md leading-7 text-green-100">
                Join the trusted student network for borrowing and lending everyday items.
                Safe, secure, and right on your campus.
              </p>
            </div>

            <div className="flex gap-6 border-t border-white/20 pt-6 text-sm text-green-100 max-md:flex-col max-md:gap-2">
              <span>Estudiantes verificados</span>
              <span>Plataforma segura</span>
            </div>
          </div>
        </div>

        <div className="flex w-1/2 items-center justify-center p-12 max-md:w-full max-md:p-8">
          {vista === "registro" ? (
            <Registro cambiarVista={cambiarVista} />
          ) : (
            <Login cambiarVista={cambiarVista} onLogin={onLogin} />
          )}
        </div>
      </div>
    </div>
  );
}
