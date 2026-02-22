import { relations } from "drizzle-orm";
import {
	integer,
	pgEnum,
	pgTable,
	text,
	timestamp,
	uuid,
	varchar,
} from "drizzle-orm/pg-core";

// ---------- Enums ----------

export const topicStatusEnum = pgEnum("topic_status", [
	"drafting",
	"generating",
	"active",
	"archived",
]);

export const messageRoleEnum = pgEnum("message_role", ["user", "assistant"]);

// ---------- Tables ----------

export const profiles = pgTable("profiles", {
	id: uuid().primaryKey(),
	displayName: varchar("display_name", { length: 100 }).notNull(),
	createdAt: timestamp("created_at", { withTimezone: true })
		.notNull()
		.defaultNow(),
	updatedAt: timestamp("updated_at", { withTimezone: true })
		.notNull()
		.defaultNow(),
});

export const topics = pgTable("topics", {
	id: uuid().primaryKey().defaultRandom(),
	userId: uuid("user_id")
		.notNull()
		.references(() => profiles.id, { onDelete: "cascade" }),
	title: varchar({ length: 100 }).notNull(),
	status: topicStatusEnum().notNull().default("drafting"),
	createdAt: timestamp("created_at", { withTimezone: true })
		.notNull()
		.defaultNow(),
	updatedAt: timestamp("updated_at", { withTimezone: true })
		.notNull()
		.defaultNow(),
});

export const conversations = pgTable("conversations", {
	id: uuid().primaryKey().defaultRandom(),
	topicId: uuid("topic_id")
		.notNull()
		.references(() => topics.id, { onDelete: "cascade" }),
	createdAt: timestamp("created_at", { withTimezone: true })
		.notNull()
		.defaultNow(),
});

export const messages = pgTable("messages", {
	id: uuid().primaryKey().defaultRandom(),
	conversationId: uuid("conversation_id")
		.notNull()
		.references(() => conversations.id, { onDelete: "cascade" }),
	role: messageRoleEnum().notNull(),
	content: text().notNull(),
	createdAt: timestamp("created_at", { withTimezone: true })
		.notNull()
		.defaultNow(),
});

export const roadmaps = pgTable("roadmaps", {
	id: uuid().primaryKey().defaultRandom(),
	topicId: uuid("topic_id")
		.notNull()
		.unique()
		.references(() => topics.id, { onDelete: "cascade" }),
	overview: text().notNull(),
	createdAt: timestamp("created_at", { withTimezone: true })
		.notNull()
		.defaultNow(),
});

export const sections = pgTable("sections", {
	id: uuid().primaryKey().defaultRandom(),
	roadmapId: uuid("roadmap_id")
		.notNull()
		.references(() => roadmaps.id, { onDelete: "cascade" }),
	title: varchar({ length: 200 }).notNull(),
	order: integer().notNull(),
	createdAt: timestamp("created_at", { withTimezone: true })
		.notNull()
		.defaultNow(),
});

export const materials = pgTable("materials", {
	id: uuid().primaryKey().defaultRandom(),
	sectionId: uuid("section_id")
		.notNull()
		.unique()
		.references(() => sections.id, { onDelete: "cascade" }),
	content: text().notNull(),
	createdAt: timestamp("created_at", { withTimezone: true })
		.notNull()
		.defaultNow(),
});

// ---------- Relations ----------

export const profilesRelations = relations(profiles, ({ many }) => ({
	topics: many(topics),
}));

export const topicsRelations = relations(topics, ({ one, many }) => ({
	profile: one(profiles, {
		fields: [topics.userId],
		references: [profiles.id],
	}),
	conversations: many(conversations),
	roadmap: one(roadmaps),
}));

export const conversationsRelations = relations(
	conversations,
	({ one, many }) => ({
		topic: one(topics, {
			fields: [conversations.topicId],
			references: [topics.id],
		}),
		messages: many(messages),
	}),
);

export const messagesRelations = relations(messages, ({ one }) => ({
	conversation: one(conversations, {
		fields: [messages.conversationId],
		references: [conversations.id],
	}),
}));

export const roadmapsRelations = relations(roadmaps, ({ one, many }) => ({
	topic: one(topics, {
		fields: [roadmaps.topicId],
		references: [topics.id],
	}),
	sections: many(sections),
}));

export const sectionsRelations = relations(sections, ({ one }) => ({
	roadmap: one(roadmaps, {
		fields: [sections.roadmapId],
		references: [roadmaps.id],
	}),
	material: one(materials),
}));

export const materialsRelations = relations(materials, ({ one }) => ({
	section: one(sections, {
		fields: [materials.sectionId],
		references: [sections.id],
	}),
}));
