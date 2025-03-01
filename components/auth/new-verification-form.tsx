"use client";

import { HashLoader } from "react-spinners";
import { CardWrapper } from "./card-wrapper";
import { useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { newVerification } from "@/actions/new-verification";
import { FormError } from "../form-error";
import { FormSuccess } from "../form-success";

export const NewVerificationForm = () => {
    const [success, setSuccess] = useState<string | undefined>("");
    const [error, setError] = useState<string | undefined>("");
    const searchParams = useSearchParams();

    const token = searchParams.get("token");

    const onSubmit = useCallback(()=>{

        if(success || error) return;

        if(!token) {
            setError("Token has not exist!");
            return;
        }

        newVerification(token)
        .then((data)=>{
            setSuccess(data.success);
            setError(data.error);
        }).catch(()=>{
            setError("Something went wrong!");
        });
    }, [token, success, error])

    useEffect(()=>{
        onSubmit()
    }, [onSubmit])

  return (
    <CardWrapper
      headerLabel="Confirm your email verification"
      backButtonLabel="Back to login"
      backButtonHref="/auth/login"
      showSocial={false}
    >
      <div className="w-full flex items-center justify-center">
        {
            !success && !error && (
                <HashLoader color="#3b82f6" size={50} />
            )
        }
        <FormSuccess message={success} />
        {
            !success && (<FormError message={error} />)
        }
      </div>
    </CardWrapper>
  );
};
