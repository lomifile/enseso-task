import * as Yup from "yup";
const validator = Yup.object({
  Message_Type: Yup.string().optional(),
  EO_ID: Yup.string().when("Message_Type", {
    is: "1-2",
    then: (schema) => schema.required(),
    otherwise: (schema) => schema.optional(),
  }),
  EO_CODE: Yup.string().when("Message_Type", {
    is: "1-2",
    then: (schema) => schema.required(),
    otherwise: (schema) => schema.optional(),
  }),
  EO_Type: Yup.string().oneOf(["1", "2", "3", "4"]).required(),
  EO_Name1: Yup.string().required(),
  EO_Name2: Yup.string().optional(),
  EO_Address_Name: Yup.string().optional(),
  EO_Address_StreetOne: Yup.string().required(),
  EO_Address_StreetTwo: Yup.string().optional(),
  EO_Address_PostCode: Yup.string().optional(),
  EO_Address_City: Yup.string().required(),
  EO_A_Info: Yup.string().optional(),
  EO_CountryReg: Yup.string().max(2).required(),
  EO_Email: Yup.string().email().required(),
  EO_Phone: Yup.string().required(),
  VAT_R: Yup.string().oneOf(["0", "1"]).required(),
  VAT_N: Yup.string().when("VAT_R", {
    is: "1",
    then: (schema) => schema.required("VAT_N is required when VAT_R is true"),
    otherwise: (schema) => schema.notRequired(),
  }),
  TAX_N: Yup.string().when("VAT_R", {
    is: "0",
    then: (schema) => schema.required("TAX_N is required when VAT_R is false"),
    otherwise: (schema) => schema.notRequired(),
  }),
  EO_ExciseNumber1: Yup.string().oneOf(["0", "1"]).required(),
  EO_ExciseNumber2: Yup.string().when("EO_ExciseNumber1", {
    is: "1",
    then: (schema) => schema.required(),
    otherwise: (schema) => schema.optional(),
  }),
  OtherEOID_R: Yup.string().oneOf(["0", "1"]).required(),
  OtherEOID_N_list: Yup.object({
    OtherEOID_N: Yup.string(),
  }).when("OtherEOID_R", {
    is: "1",
    then: (schema) => schema.required(),
    otherwise: (schema) => schema.optional(),
  }),
  Reg_3RD: Yup.string().oneOf(["0", "1"]).required(),
  Reg_EOID: Yup.string().when("Reg_3RD", {
    is: "1",
    then: (schema) => schema.required(),
    otherwise: (schema) => schema.optional(),
  }),
  EO_OtherID: Yup.string().optional(),
  Extensibility: Yup.string().optional(),
});

type CreateEoFormType = Yup.InferType<typeof validator>;

const deleteValidator = Yup.object({
  Message_Type: Yup.string().required(),
  EO_ID: Yup.string().required(),
  EO_CODE: Yup.string().required(),
  Reg_3RD: Yup.string().oneOf(["0", "1"]).required(),
  Reg_EOID: Yup.string().when("Reg_3RD", {
    is: "1",
    then: (schema) => schema.required(),
    otherwise: (schema) => schema.optional(),
  }),
});

type DeleteEoType = Yup.InferType<typeof deleteValidator>;

export { validator, deleteValidator, type CreateEoFormType, type DeleteEoType };
