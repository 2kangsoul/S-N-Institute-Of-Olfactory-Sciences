// "use client";
// import { useForm } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { toast } from "react-toastify";
// import { AxiosError } from "axios";
// import { useRegister } from "@/src/Features/Auth/auth.hooks";
// import {
//   authRegisterValidation,
//   AuthRegisterType,
// } from "@/src/Features/Auth/auth.validation";
// import { ApiResponse } from "@/src/types/api-response.type";
 
// interface RegisterModalProps {
//   isOpen: boolean;
//   onClose: () => void;
//   onSwitchToLogin?: () => void;
// }
 
// export default function RegisterModal({
//   isOpen,
//   onClose,
//   onSwitchToLogin,
// }: RegisterModalProps) {
//   const registerMutation = useRegister();
 
//   const {
//     register,
//     handleSubmit,
//     reset,
//     formState: { errors },
//   } = useForm<AuthRegisterType>({
//     resolver: zodResolver(authRegisterValidation),
//   });
 
//   if (!isOpen) return null;
 
//   const handleCloseModal = () => {
//     reset();
//     onClose();
//   };
 
//   const onSubmit = (values: AuthRegisterType) => {
//     registerMutation.mutate(values, {
//       onSuccess: () => {
//         toast.success("Akun berhasil dibuat! Silakan Sign In.");
//         handleCloseModal();
//         if (onSwitchToLogin) onSwitchToLogin();
//       },
//       onError: (error) => {
//         const err = error as AxiosError<ApiResponse<null>>;
//         toast.error(err.response?.data?.message || "Register gagal");
//       },
//     });
//   };
 
//   return (
//     <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
//       <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden transform transition-all max-h-[90vh] overflow-y-auto">
//         {/* Header Modal */}
//         <div className="flex justify-between items-center p-5 border-b border-gray-100 bg-[#f4f2ee]/30">
//           <h2 className="text-xl font-bold text-gray-900 tracking-tight">
//             Buat Akun
//           </h2>
//           <button
//             onClick={handleCloseModal}
//             className="text-gray-400 hover:text-gray-700 transition-colors focus:outline-none cursor-pointer"
//           >
//             <svg
//               xmlns="http://www.w3.org/2000/svg"
//               className="h-5 w-5"
//               fill="none"
//               viewBox="0 0 24 24"
//               stroke="currentColor"
//             >
//               <path
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//                 strokeWidth={2}
//                 d="M6 18L18 6M6 6l12 12"
//               />
//             </svg>
//           </button>
//         </div>
 
//         {/* Form Area */}
//         <div className="p-6">
//           <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
//             <div>
//               <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
//                 Nama Lengkap
//               </label>
//               <input
//                 type="text"
//                 {...register("fullName")}
//                 className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 text-sm transition-all"
//                 placeholder="Masukkan nama Anda"
//               />
//               {errors.fullName && (
//                 <p className="text-red-500 text-xs mt-1">
//                   {errors.fullName.message}
//                 </p>
//               )}
//             </div>
 
//             <div>
//               <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
//                 Username
//               </label>
//               <input
//                 type="text"
//                 {...register("username")}
//                 className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 text-sm transition-all"
//                 placeholder="Pilih username"
//               />
//               {errors.username && (
//                 <p className="text-red-500 text-xs mt-1">
//                   {errors.username.message}
//                 </p>
//               )}
//             </div>
 
//             <div>
//               <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
//                 Email
//               </label>
//               <input
//                 type="email"
//                 {...register("email")}
//                 className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 text-sm transition-all"
//                 placeholder="nama@email.com"
//               />
//               {errors.email && (
//                 <p className="text-red-500 text-xs mt-1">
//                   {errors.email.message}
//                 </p>
//               )}
//             </div>
 
//             <div>
//               <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
//                 Password
//               </label>
//               <input
//                 type="password"
//                 {...register("password")}
//                 className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 text-sm transition-all"
//                 placeholder="Minimal 8 karakter"
//               />
//               {errors.password && (
//                 <p className="text-red-500 text-xs mt-1">
//                   {errors.password.message}
//                 </p>
//               )}
//             </div>
 
//             <button
//               type="submit"
//               disabled={registerMutation.isPending}
//               className={`mt-2 w-full py-3 bg-gray-900 text-white text-sm font-bold uppercase tracking-wider rounded-lg transition-colors shadow-md cursor-pointer ${
//                 registerMutation.isPending ? "opacity-50" : "hover:bg-gray-800"
//               }`}
//             >
//               {registerMutation.isPending ? "Membuat Akun..." : "Buat Akun"}
//             </button>
 
//             {onSwitchToLogin && (
//               <p className="text-center text-xs text-gray-500 mt-4">
//                 Sudah punya akun?{" "}
//                 <button
//                   type="button"
//                   onClick={onSwitchToLogin}
//                   className="text-gray-900 font-bold hover:underline cursor-pointer"
//                 >
//                   Sign In
//                 </button>
//               </p>
//             )}
//           </form>
//         </div>
//       </div>
//     </div>
//   );
// }
 