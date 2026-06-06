import { useState } from "react";

import API from "../services/api";

export default function Register() {

  const [form, setForm] =
    useState({

      name: "",

      email: "",

      password: "",

      role: "user",

      phone: "",

      whatsapp: "",

      address: "",

      bio: "",

    });

  const submitHandler =
  async (e) => {

    e.preventDefault();

    try {

      await API.post(
        "/auth/register",
        form
      );

      alert(
        "Register Success"
      );

      window.location.href =
        "/login";

    } catch (error) {

      alert(

        error.response?.data?.message ||

        "Register Failed"

      );

    }

  };

  return (

    <div className="
      min-h-screen
      flex
      justify-center
      items-center
      bg-gray-100
      p-6
    ">

      <form
        onSubmit={submitHandler}
        className="
          bg-white
          p-8
          rounded-lg
          shadow-lg
          w-full
          max-w-lg
        "
      >

        <h2 className="
          text-3xl
          font-bold
          mb-6
          text-center
        ">
          Register
        </h2>

        <input
          type="text"
          placeholder="Name"
          className="
            w-full
            border
            p-3
            mb-4
            rounded
          "
          onChange={(e)=>

            setForm({

              ...form,

              name:
                e.target.value

            })

          }
        />

        <input
          type="email"
          placeholder="Email"
          className="
            w-full
            border
            p-3
            mb-4
            rounded
          "
          onChange={(e)=>

            setForm({

              ...form,

              email:
                e.target.value

            })

          }
        />

        <input
          type="password"
          placeholder="Password"
          className="
            w-full
            border
            p-3
            mb-4
            rounded
          "
          onChange={(e)=>

            setForm({

              ...form,

              password:
                e.target.value

            })

          }
        />

        <select
          className="
            w-full
            border
            p-3
            mb-4
            rounded
          "
          onChange={(e)=>

            setForm({

              ...form,

              role:
                e.target.value

            })

          }
        >

          <option value="user">
            User
          </option>

          <option value="seller">
            Seller
          </option>

        </select>

        {/* SELLER DETAILS */}

        {
          form.role ===
          "seller" && (

            <>

              <input
                type="text"
                placeholder="Phone Number"
                className="
                  w-full
                  border
                  p-3
                  mb-4
                  rounded
                "
                onChange={(e)=>

                  setForm({

                    ...form,

                    phone:
                      e.target.value

                  })

                }
              />

              <input
                type="text"
                placeholder="WhatsApp Number"
                className="
                  w-full
                  border
                  p-3
                  mb-4
                  rounded
                "
                onChange={(e)=>

                  setForm({

                    ...form,

                    whatsapp:
                      e.target.value

                  })

                }
              />

              <input
                type="text"
                placeholder="Address"
                className="
                  w-full
                  border
                  p-3
                  mb-4
                  rounded
                "
                onChange={(e)=>

                  setForm({

                    ...form,

                    address:
                      e.target.value

                  })

                }
              />

              <textarea
                placeholder="Bio"
                className="
                  w-full
                  border
                  p-3
                  mb-4
                  rounded
                "
                rows="4"
                onChange={(e)=>

                  setForm({

                    ...form,

                    bio:
                      e.target.value

                  })

                }
              />

            </>

          )
        }

        <button
          className="
            w-full
            bg-green-500
            text-white
            py-3
            rounded
            font-bold
          "
        >
          Register
        </button>

      </form>

    </div>

  );

}