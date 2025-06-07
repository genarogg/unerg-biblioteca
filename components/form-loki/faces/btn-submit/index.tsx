import React, { useState } from 'react'
import { useGoogleReCaptcha } from 'react-google-recaptcha-v4';
import { print } from 'graphql';
import { RECAPTCHA_KEY, URL_BACKEND } from "@env";
import { notify } from "@nano"
import { isStrongPassword, isValidEmail } from "@fn"
import "./_btnSubmitBasic.scss"



interface BtnSubmitBasicProps<> {
  children: React.ReactNode;
  className?: string;
  id?: string;
  disable?: boolean;
  formData: any;
  constext: string;
}

const BtnSubmitBasic = ({
  children,
  className = "",
  id = "",
  formData,
  constext,
}: BtnSubmitBasicProps) => {

  const [loading, setLoading] = useState(false);
  const { executeRecaptcha } = useGoogleReCaptcha();

  let rebootToken: string | null;
  let tokenCaptcha: string;
  let response: any;
  let data: any;
  let queriesConfig: any;
  const endpoint: string = URL_BACKEND + "/graphql"

  const handleSubmit = async () => {


    if (RECAPTCHA_KEY && executeRecaptcha) {
      tokenCaptcha = await executeRecaptcha("submit");
    }

    rebootToken = localStorage.getItem("reboot-token") || null;

    data = {
      ...formData.data.current,
    };

    if (constext === "login") {
      queriesConfig = {
        query: null,
        variables: {
          email: data.email.toLowerCase(),
          password: data.password,
        }
      }
    }

    if (constext === "register") {
      queriesConfig = {
        query: null,
        variables: {
          name: data.name,
          apellido: data.apellido,
          email: data.email.toLowerCase(),
          password: data.password,
          confirmPassword: data.confirmPassword,
        }
      }
    }

    if (constext === "recover-password") {
      queriesConfig = {
        query: null,
        variables: {
          email: data.email.toLowerCase(),
        }
      }
    }

    if (constext === "reboot-password") {
      queriesConfig = {
        query: null,
        variables: {
          password: data.password,
          confirmPassword: data.confirmPassword,
          tokenCaptcha,
          rebootToken
        }
      }
    }

    try {
      // validaciones
      if (!data.email && constext !== "reboot-password") {
        notify({ type: "error", message: "El email es requerido" })
        return
      }

      if (!data.password && constext !== "recover-password") {
        notify({ type: "error", message: "La contraseña es requerida" })
        return
      }

      if (constext === "register" || constext === "reboot-password") {

        if (!data.confirmPassword) {
          notify({ type: "error", message: "La confirmación de la contraseña es requerida" })
          return
        }

        if (data.password !== data.confirmPassword) {
          notify({ type: "error", message: "Las contraseñas no coinciden" })
          return
        }

        if (!isStrongPassword(data.password)) {
          notify({ type: "warning", message: "La contraseña debe tener al menos 8 caracteres, incluir letras, números y al menos un símbolo" })
          return
        }
      }

      if (constext === "register") {

        if (!isValidEmail(data.email)) {
          notify({ type: "error", message: "El email no es válido" })
          return
        }

        if (!data.name) {
          notify({ type: "error", message: "El nombre es requerido" })
          return
        }

        if (!data.apellido) {
          notify({ type: "error", message: "El apellido es requerido" })
          return
        }
      }

      response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: print(queriesConfig.query),
          variables: queriesConfig.variables,
        }),
      });

      if (!response) {
        notify({ type: "error", message: "Error al enviar la solicitud" });
        return;
      }

      const responseData = await response.json();

      const { data: datos, type, message } = responseData;

      notify({ type, message });

      console.log(datos)

      return

    }
    catch (error) {
      console.error("Error en las validaciones", error)
    }
    finally {
      setLoading(false)
    }

  }

  return (
    <div className={`btn-submit-basic ${className}`} id={id}>
      <button
        disabled={loading}
        onClick={() => {
          setLoading(true);
          handleSubmit();
        }}>
        {children}
      </button>
    </div>
  );
};

export default BtnSubmitBasic;