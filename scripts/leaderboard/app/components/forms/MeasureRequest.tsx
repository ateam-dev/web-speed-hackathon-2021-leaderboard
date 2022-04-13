import {
  FormControl,
  FormErrorMessage,
  Input,
  InputProps,
} from "@chakra-ui/react";
import { PrimaryButton } from "~/components/atoms/Button";
import { withZod } from "@remix-validated-form/with-zod";
import { QueueModel, TeamModel } from "~/zod";
import {
  useField,
  useFormContext,
  useIsSubmitting,
  validationError,
  ValidatedForm,
  FormProps,
} from "remix-validated-form";
import { ComponentProps } from "react";
import { hasProcessingQueue, lineup } from "~/request/Queue";
import { z } from "zod";

const zodFormModel = QueueModel.pick({ teamId: true }).merge(
  TeamModel.extend({ pageUrl: z.string().url() }).pick({ pageUrl: true })
);

const clientValidator = withZod(zodFormModel);
const serverValidator = withZod(
  zodFormModel.refine(
    async (data) => {
      const having = await hasProcessingQueue({ teamId: data.teamId });
      return !having;
    },
    { message: "Jobs are in measurement or waiting.", path: ["pageUrl"] }
  )
);

export const handler = async (data: FormData) => {
  if (!data.has("lineup")) return;
  const fieldValues = await serverValidator.validate(data);
  if (fieldValues.error) throw validationError(fieldValues.error);
  const { teamId, pageUrl } = fieldValues.data;

  await lineup({ teamId, pageUrl });

  return true;
};

export const MeasureRequestFormWrapper = ({
  children,
  ...props
}: Partial<FormProps<z.infer<typeof zodFormModel>>>) => {
  return (
    <ValidatedForm method="post" validator={clientValidator} {...props}>
      {children}
    </ValidatedForm>
  );
};

export const PageUrlInput = (props: Partial<InputProps>) => {
  const { error, getInputProps } = useField("pageUrl");
  return (
    <FormControl isInvalid={!!error}>
      <Input {...getInputProps()} {...props} />
      {error && <FormErrorMessage>{error}</FormErrorMessage>}
    </FormControl>
  );
};

export const Submit = (
  props: Partial<ComponentProps<typeof PrimaryButton>>
) => {
  const isSubmitting = useIsSubmitting();
  const { isValid } = useFormContext();
  return (
    <PrimaryButton
      type="submit"
      disabled={isSubmitting || !isValid}
      name="lineup"
      {...props}
    >
      {isSubmitting ? "Submitting..." : "Submit"}
    </PrimaryButton>
  );
};
