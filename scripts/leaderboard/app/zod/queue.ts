import * as z from "zod"
import * as imports from "./customs"
import { queue_status } from "@prisma/client"
import { CompleteTeam, RelatedTeamModel, CompleteMeasurement, RelatedMeasurementModel } from "./index"

// Helper schema for JSON fields
type Literal = boolean | number | string
type Json = Literal | { [key: string]: Json } | Json[]
const literalSchema = z.union([z.string(), z.number(), z.boolean()])
const jsonSchema: z.ZodSchema<Json> = z.lazy(() => z.union([literalSchema, z.array(jsonSchema), z.record(jsonSchema)]))

export const QueueModel = z.object({
  id: z.string(),
  teamId: z.string(),
  status: z.nativeEnum(queue_status),
  data: jsonSchema,
  createdAt: z.date(),
  updatedAt: z.date(),
})

export interface CompleteQueue extends z.infer<typeof QueueModel> {
  Team: CompleteTeam
  Measurement?: CompleteMeasurement | null
}

/**
 * RelatedQueueModel contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const RelatedQueueModel: z.ZodSchema<CompleteQueue> = z.lazy(() => QueueModel.extend({
  Team: RelatedTeamModel,
  Measurement: RelatedMeasurementModel.nullish(),
}))
