import React, { useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import md5 from "md5";
import { getDatabase, ref, set } from "firebase/database";
import {
  getAuth,
  createUserWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";

function RegisterPage() {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const [errorFromSubmit, setErrorFromSubmit] = useState("");
  const [loading, setLoading] = useState(false); // 버튼 초기 비활성화

  const password = useRef();
  password.current = watch("password"); // name이 password인 것을 입력할 때 마다 값을 가져옴

  // 비동기 요청
  // data에 email, name, password, password_confirm 정보가 있음
  const onSubmit = async (data) => {
    try {
      setLoading(true); //  버튼 활성화

      const auth = getAuth();
      let createdUser = await createUserWithEmailAndPassword(
        auth,
        data.email,
        data.password
      );

      // user.email의 유니크 한 값을 이용해서 이미지 프로필 랜덤 생성
      await updateProfile(auth.currentUser, {
        displayName: data.name,
        photoURL: `http://gravatar.com/avatar/${md5(
          createdUser.user.email
        )}?d=identicon`,
      });

      //Firebase 데이터베이스에 저장해주기
      set(ref(getDatabase(), `users/${createdUser.user.uid}`), {
        name: createdUser.user.displayName,
        image: createdUser.user.photoURL,
      });

      console.log(createdUser);

      setLoading(false); // 버튼 비활성화
    } catch (error) {
      setErrorFromSubmit(error.message);
      setLoading(false);
      setTimeout(() => {
        setErrorFromSubmit("");
      }, 5000);
    }
  };

  // useForm을 이용한 유효성 검사
  return (
    <div className="auth-wrapper">
      <div style={{ textAlign: "center" }}>
        <h3>Register</h3>
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <label>Email</label>
        <input
          name="email"
          type="email"
          {...register("email", { required: true, pattern: /^\S+@\S+$/i })} // 이메일 정규표현식
        />
        {errors.email && <p>This field is required</p>}

        <label>Name</label>
        <input
          name="name"
          {...register("name", { required: true, maxLength: 10 })}
        />
        {errors.name && errors.name.type === "required" && (
          <p>This name field is required</p>
        )}
        {errors.name && errors.name.type === "maxLength" && (
          <p>Your input exceed maximum length</p>
        )}

        <label>Passwrod</label>
        <input
          name="password"
          type="password"
          {...register("password", { required: true, minLength: 6 })}
        />
        {errors.password && errors.password.type === "required" && (
          <p>This password field is required</p>
        )}
        {errors.password && errors.password.type === "minLength" && (
          <p>Password must have at least 6 characters</p>
        )}

        {/* password 와 같아야함 */}
        <label>Password Confirm</label>
        <input
          name="password_confirm"
          type="password"
          {...register("password_confirm", {
            required: true,
            validate: (value) => value === password.current, // password와 password_confirm이 같은지 체크
          })}
        />
        {errors.password_confirm &&
          errors.password_confirm.type === "required" && (
            <p>This password confirm field is required</p>
          )}
        {errors.password_confirm &&
          errors.password_confirm.type === "validate" && (
            <p>The passwords do not match</p>
          )}

        {errorFromSubmit && <p>{errorFromSubmit}</p>}

        <input type="submit" value="SUBMIT" disabled={loading} />
        <Link style={{ color: "grey", textDecoration: "none" }} to="/login">
          이미 아이디가 있다면...
        </Link>
      </form>
    </div>
  );
}

export default RegisterPage;
